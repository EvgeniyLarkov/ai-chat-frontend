import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { apiVersion, serverHost, serverPort } from './config';
import endpoints, { wsEndpoints } from './routes';
import SocketsConnectionHandler from './sockets';

class TransportLayer {
    serverHost = serverHost;
    serverPort = serverPort;
    apiVersion = apiVersion;

    routes = endpoints;
    wsRoutes = wsEndpoints;

    wsConnections = {};
    wsReactionStack = {};

    constructor(errorsHandler, authProvider) {
        makeAutoObservable(this);
        this.serverURL = this.serverHost + ":" + this.serverPort;
        this.authProvider = authProvider;
        this.errorsHandler = errorsHandler;
    }

    async adminLogin(data) {

    }

    async loginUser(data) {
        return this.makePost(this.routes.userLogin, { data });
    }

    async registerUser(data) {
        return this.makePost(this.routes.userRegister, { data })
    }

    async getChatDialogs(options) {
        return this.makePost(this.routes.getDialogs, options)
    }

    async getDialogMessages(options) {
        return this.makePost(this.routes.getDialogMessages, options)
    }

    async sendMessageToDialog(options) {
        return this.makePost(this.routes.postDialogMessage, options)
    }

    async wsSendMessageToDialog(options) {
        return this.makeWSPost(this.wsRoutes.sendDialogMessage, options)
    }

    async wsGetDialogsMetadata(options) {
        return this.makeWSPost(this.wsRoutes.getDialogMetadata, options)
    }

    async wsSendUserTyping(options) {
        return this.makeWSPost(this.wsRoutes.userTyping, options)
    }

    getUrl(route) {
        return `http://${this.serverHost}:${this.serverPort}/api/${this.apiVersion}/${route}`;
    }

    addReaction(eventName, namespace, reaction) {
        if (!this.wsReactionStack[namespace]) this.wsReactionStack[namespace] = {};

        this.wsReactionStack[namespace][eventName] = reaction;

        if (this.wsConnections[namespace]) {
            this.wsConnections[namespace].addReaction(eventName, reaction);
        }
    }

    async createWsConnection(namespace) {
        this.wsConnections[namespace] = new SocketsConnectionHandler(this.authProvider, namespace, this.wsReactionStack[namespace]);
        return this.wsConnections[namespace];
    }

    async makeWSPost(endpoint, options = {}) {
        const data = options.data ? options.data : null;

        const routeText = endpoint.url(options);
        const namespace = endpoint.namespace;
        const eventText = endpoint.event;

        if (!this.wsConnections[namespace]) {
            this.createWsConnection(namespace);
        }

        return this.wsConnections[namespace].emit({
            namespace: routeText,
            event: eventText,
            data
        })
    }

    async makePost(endpoint, options = {}) {
        const data = options.data ? options.data : null;

        const routeText = endpoint.url(options);

        const token = this.authProvider.token;

        return axios({
            method: endpoint.method,
            url: this.getUrl(routeText),
            data,
            headers: { 
               Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.data)
            .catch((err) => {
                this.errorsHandler.add(err);
            })
    }
}

export default TransportLayer;