import { makeAutoObservable } from "mobx";
import { io } from "socket.io-client";
import { serverHost, serverPort } from "./config";

export const ConnectionStates = {
    connectig: 'connectig',
    connected: 'connected',
    unconnected: 'unconnected',
}

class SocketsConnectionHandler {
    state = ConnectionStates.unconnected;

    constructor(authProvider) {
        makeAutoObservable(this);

        this.serverHost = serverHost;
        this.serverPort = serverPort;
        this.authProvider = authProvider;

        this.io = io(`http://${this.serverHost}:${this.serverPort}/`, {
            extraHeaders: {
                Authorization: `Bearer ${this.authProvider.token}`
            }
        });

        this.state = ConnectionStates.connectig;

        this.io.on("connect", () => {
            this.handleConnection();
        })

        this.io.on("disconnect", () => {
            this.handleDisconnection();
        });
    }

    handleConnection() {
        this.state = ConnectionStates.connected;
    }

    handleDisconnection() {
        this.state = ConnectionStates.unconnected;
    }
}

export default SocketsConnectionHandler;