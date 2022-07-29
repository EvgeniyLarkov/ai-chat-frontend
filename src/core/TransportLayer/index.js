import axios from 'axios';

class TransportLayer {
    serverHost = '127.0.0.1';
    serverPort = 3000;
    apiVersion = 'v1';

    routes = {
        'userLogin': `auth/email/login`,
        'userRegister': `auth/email/register`,
    };

    constructor(errorsHandler) {
        this.serverURL = this.serverHost + ":" + this.serverPort;
        this.errorsHandler = errorsHandler;
    }

    async adminLogin(data) {

    }

    async loginUser(data) {
        return axios.post(
            this.getUrl(this.routes.userLogin),
            data
        ).then((res) => res.data)
        .catch((err) => {
            this.errorsHandler.add(err);
        })
    }

    async registerUser(data) {
        return axios.post(
                this.getUrl(this.routes.userRegister),
                data
            ).then((res) => res.data)
            .catch((err) => {
                this.errorsHandler.add(err);
            })
    }

    getUrl(route) {
        return `http://${this.serverHost}:${this.serverPort}/api/${this.apiVersion}/${route}`;
    }
}

export default TransportLayer;