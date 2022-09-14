import axios from 'axios';
import endpoints from './routes';

class TransportLayer {
    serverHost = '127.0.0.1';
    serverPort = 3000;
    apiVersion = 'v1';

    routes = endpoints;

    constructor(errorsHandler, authProvider) {
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

    getUrl(route) {
        return `http://${this.serverHost}:${this.serverPort}/api/${this.apiVersion}/${route}`;
    }

    async makePost(endpoint, options = {}) {
        const data = options.data ? options.data : null;

        const routeText = endpoint.url(options);

        const token = this.authProvider.getToken();

        return axios({
            method: endpoint.method,
            url: this.getUrl(routeText),
            data,
            headers: { 
                ...(token ?? { Authorization: `Bearer ${token}` })
            }
        })
            .then((res) => res.data)
            .catch((err) => {
                this.errorsHandler.add(err);
            })
    }
}

export default TransportLayer;