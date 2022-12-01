import axios, { AxiosError, AxiosResponse } from 'axios';
import AuthProvider from 'core/AuthProvider';
import {makeAutoObservable} from 'mobx';
import type ErrorStore from 'storage/error';
import Reactions, { ServerToClientEvents } from 'storage/reactions';
import {apiVersion, serverHost, serverPort} from './config';
import { ChatDialogsResponse, ChatMessagesResponse } from './dto/chat';
import { UserLoginResponse } from './dto/user';
import endpoints, {wsEndpoints} from './routes';
import SocketsConnectionHandler from './sockets';
import { ClientsToServerEvents, EndpointObject, RequestOptions, WsEndpointObject, WsNamespaces, WsRequestOptions } from './types';

type wsConnections = {
    [namespace in WsNamespaces]?: SocketsConnectionHandler<
        ServerToClientEvents[namespace],
        Partial<ClientsToServerEvents[namespace]>
    >
}

class TransportLayer {
    authProvider: AuthProvider
    errorsHandler: ErrorStore
	reactionsHandler: Reactions;

	serverHost = serverHost;
	serverPort = serverPort;
	apiVersion = apiVersion;

	routes = endpoints;
	wsRoutes = wsEndpoints;

	wsConnections: wsConnections;

	constructor(errorsHandler: ErrorStore, authProvider: AuthProvider, reactions: Reactions) {
		makeAutoObservable(this);
		this.authProvider = authProvider;
		this.errorsHandler = errorsHandler;
		this.reactionsHandler = reactions;
	}

	async loginUser<T>(data: T) {
		return this.makePost<T, UserLoginResponse>(this.routes.userLogin, {data});
	}

	async registerUser(data) {
		return this.makePost(this.routes.userRegister, {data});
	}

	async getChatDialogs<T>(options: RequestOptions<T> = { limit: 20, offset: 0 }) {
		return this.makePost<T, ChatDialogsResponse>(this.routes.getDialogs, options);
	}

	async getDialogMessages<T>(options: RequestOptions<T>) {
		return this.makePost<T, ChatMessagesResponse>(this.routes.getDialogMessages, options);
	}

	async sendMessageToDialog<T>(options: RequestOptions<T>) {
		return this.makePost(this.routes.postDialogMessage, options);
	}

	async wsSendMessageToDialog<T>(options: WsRequestOptions<T>) {
		return this.makeWSPost(this.wsRoutes.sendDialogMessage, options);
	}

	async wsGetDialogsMetadata<T>(options: WsRequestOptions<T>) {
		return this.makeWSPost(this.wsRoutes.getDialogMetadata, options);
	}

	async wsSendUserTyping<T>(options: WsRequestOptions<T>) {
		return this.makeWSPost(this.wsRoutes.userTyping, options);
	}

	getUrl(route: string) {
		return `http://${this.serverHost}:${this.serverPort}/api/${this.apiVersion}/${route}`;
	}

	createWsConnection(namespace: WsNamespaces) {
		const connection = new SocketsConnectionHandler<
				ServerToClientEvents[typeof namespace],
        		Partial<ClientsToServerEvents[typeof namespace]>
            >(
            this.authProvider,
            namespace,
            this.reactionsHandler.byNamespace[namespace]
        );

        this.wsConnections[namespace] = connection;

		return connection;
	}

	async makeWSPost<T>(endpoint: WsEndpointObject, options: WsRequestOptions<T>) {
		const data = options.data ? options.data : null;

		const {namespace} = endpoint;
		const eventText = endpoint.event;

		let thisConnection = this.wsConnections[namespace];
		if (!thisConnection) {
			thisConnection = this.createWsConnection(namespace);
		}

		return thisConnection.emit({
			event: eventText,
			data,
		});
	}

	async makePost<T, Res>(endpoint: EndpointObject, options: RequestOptions<T>): Promise<Res> {
		const data = options.data ? options.data : null;

		const routeText = endpoint.url(options);

		const {token} = this.authProvider;

        try {
            const request: AxiosResponse<Res>  = await axios({
                method: endpoint.method,
                url: this.getUrl(routeText),
                data,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            return request.data;
        } catch (err: AxiosError | any) {
            this.errorsHandler.add(err);

			return err;
        }
	}
}

export default TransportLayer;
