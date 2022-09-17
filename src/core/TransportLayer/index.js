import axios from 'axios';
import { makeAutoObservable } from 'mobx';
import { apiVersion, serverHost, serverPort } from './config';
import endpoints from './routes';
import SocketsConnectionHandler from './sockets';

class TransportLayer {
    serverHost = serverHost;
    serverPort = serverPort;
    apiVersion = apiVersion;

    routes = endpoints;

    constructor(errorsHandler, authProvider) {
        makeAutoObservable(this);
        this.serverURL = this.serverHost + ":" + this.serverPort;
        this.authProvider = authProvider;
        this.errorsHandler = errorsHandler;
        this.socketsHandler = new SocketsConnectionHandler(authProvider);
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

    getUrl(route) {
        return `http://${this.serverHost}:${this.serverPort}/api/${this.apiVersion}/${route}`;
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