import axios, { AxiosError, AxiosResponse } from 'axios';
import AuthProvider from 'core/AuthProvider';
import { makeAutoObservable } from 'mobx';
import type ErrorStore from 'storage/error';
import Reactions, { ServerToClientEvents } from 'storage/reactions';
import { transformError } from 'utils/transformError';
import { apiVersion, serverHost, serverPort } from './config';
import { ChatDialogsResponse, ChatMessagesResponse } from './dto/chat';
import {
	UserLoginResponse,
	UserRegisterResponse,
	UserUpdateInfoResponse,
	UserUploadFileResponse,
} from './dto/user';
import endpoints, { wsEndpoints } from './routes';
import SocketsConnectionHandler from './sockets';
import {
	ClientsToServerEvents,
	EndpointObject,
	RequestFileOptions,
	RequestOptions,
	UnsuccssesRequest,
	WsEndpointObject,
	WsNamespaces,
	WsRequestOptions,
} from './types';

type wsConnections = {
	[namespace in WsNamespaces]?: SocketsConnectionHandler<
		ServerToClientEvents[namespace],
		Partial<ClientsToServerEvents[namespace]>
	>;
};

class TransportLayer {
	authProvider: AuthProvider;

	errorsHandler: ErrorStore;

	reactionsHandler: Reactions | null = null;

	serverHost = serverHost;

	serverPort = serverPort;

	apiVersion = apiVersion;

	routes = endpoints;

	wsRoutes = wsEndpoints;

	wsConnections?: wsConnections;

	reactionsHandlerConnectPromise: Promise<void>;

	applyReactionsHandler: (handler: Reactions) => void;

	constructor(errorsHandler: ErrorStore, authProvider: AuthProvider) {
		makeAutoObservable(this);
		this.authProvider = authProvider;
		this.errorsHandler = errorsHandler;

		this.reactionsHandlerConnectPromise = new Promise((res) => {
			this.applyReactionsHandler = (handler) => {
				this.reactionsHandler = handler;
				res();
			};
		});
	}

	async loginUser<T>(data: T) {
		return this.makePost<T, UserLoginResponse>(this.routes.userLogin, { data });
	}

	async registerUser<T>(data: T) {
		return this.makePost<T, UserRegisterResponse>(this.routes.userRegister, {
			data,
		});
	}

	async getChatDialogs<T>(
		options: RequestOptions<T> = { limit: 20, offset: 0 }
	) {
		return this.makePost<T, ChatDialogsResponse>(
			this.routes.getDialogs,
			options
		);
	}

	async getDialogMessages<T>(options: RequestOptions<T>) {
		return this.makePost<T, ChatMessagesResponse>(
			this.routes.getDialogMessages,
			options
		);
	}

	async updateUserInfo<T>(options: RequestOptions<T>) {
		return this.makePost<T, UserUpdateInfoResponse>(
			this.routes.updateMyInfo,
			options
		);
	}

	async uploadUserFile<T>(options: RequestFileOptions<T>) {
		return this.makeFilePost<T, UserUploadFileResponse>(
			this.routes.postUserAvatar,
			options
		);
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

	async createWsConnection(namespace: WsNamespaces) {
		return this.reactionsHandlerConnectPromise.then(() => {
			if (!this.reactionsHandler) {
				throw new Error('Reaction handler not initiated');
			}

			const connection = new SocketsConnectionHandler<
				ServerToClientEvents[typeof namespace],
				Partial<ClientsToServerEvents[typeof namespace]>
			>(this.authProvider, namespace, this.reactionsHandler);

			if (!this.wsConnections) {
				this.wsConnections = {};
			}

			this.wsConnections[namespace] = connection;

			return connection;
		});
	}

	async makeWSPost<T>(
		endpoint: WsEndpointObject,
		options: WsRequestOptions<T>
	) {
		const data = options.data ? options.data : null;

		const { namespace } = endpoint;
		const eventText = endpoint.event;

		let thisConnection = this.wsConnections?.[namespace];
		if (!thisConnection) {
			thisConnection = await this.createWsConnection(namespace);
		}

		return thisConnection.emit({
			event: eventText,
			data,
		});
	}

	async makePost<T, Res>(
		endpoint: EndpointObject,
		options: RequestOptions<T>
	): Promise<Res | UnsuccssesRequest> {
		const data = options.data ? options.data : null;

		const routeText = endpoint.url(options);

		const { token } = this.authProvider;

		try {
			const request: AxiosResponse<Res> = await axios({
				method: endpoint.method,
				url: this.getUrl(routeText),
				data,
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			return request.data;
		} catch (err: AxiosError | Error | unknown) {
			this.errorsHandler.add(err);
			return transformError(err);
		}
	}

	async makeFilePost<T, Res>(
		endpoint: EndpointObject,
		options: RequestFileOptions<T>
	): Promise<Res | UnsuccssesRequest> {
		const formData = new FormData();
		formData.append('file', options.file);
		formData.append('type', 'object');
		formData.append(
			'properties',
			JSON.stringify({
				file: {
					type: 'string',
					format: 'binary',
				},
			})
		);

		const routeText = endpoint.url(options);

		const { token } = this.authProvider;

		try {
			const request: AxiosResponse<Res> = await axios.post(
				this.getUrl(routeText),
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'content-type': 'multipart/form-data',
					},
				}
			);

			return request.data;
		} catch (err: AxiosError | Error | unknown) {
			this.errorsHandler.add(err);
			return transformError(err);
		}
	}
}

export default TransportLayer;
