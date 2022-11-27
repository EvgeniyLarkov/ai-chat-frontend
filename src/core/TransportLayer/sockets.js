import { makeAutoObservable } from "mobx";
import { io } from "socket.io-client";
import { serverHost, serverPort } from "./config";

export const ConnectionStates = {
    connecting: 'connecting',
    connected: 'connected',
    unconnected: 'unconnected',
}

class SocketsConnectionHandler {
    namespace = null;
    reactions = {};
    state = ConnectionStates.unconnected;
    io = null;

    constructor(authProvider, namespace, reactions = {}) {
        makeAutoObservable(this);

        this.serverHost = serverHost;
        this.serverPort = serverPort;
        this.authProvider = authProvider;
        this.namespace = namespace;

        this.connectionState = null;

        this.io = io(`http://${this.serverHost}:${this.serverPort}/${namespace}`, {
            extraHeaders: {
                Authorization: `Bearer ${this.authProvider.token}`
            }
        });
        console.log('started connetction to namespasce: ', this.namespace)

        this.state = ConnectionStates.connecting;

        this.connectionState = new Promise((res, rej) => {
            this.io.on("connect", () => {
                res();
                this.handleConnection();
            })
    
            this.io.on("disconnect", () => {
                rej();
                this.handleDisconnection();
            });
        })

        for (const eventName in reactions) {
            this.addReaction(eventName, reactions[eventName])
        }
    }

    handleConnection() {
        this.state = ConnectionStates.connected;

        console.log('connected to namespasce: ', this.namespace)

        for (const eventName in this.reactions) {
            const reaction = this.reactions[eventName];

            this.io.on(eventName, (data) => {
                reaction(data);
            })
        }
    }

    handleDisconnection() {
        this.state = ConnectionStates.unconnected;

        console.log('disconnected from namespasce: ', this.namespace)
    }

    addReaction(eventName, reaction) {
        console.log(`applied reaction on ${eventName} in namespace ${this.namespace}`)
        this.reactions[eventName] = reaction;
    }

    emit(options) {
        this.connectionState.then(() => {
            const { event, data } = options;

            console.log('emit to namespasce: ', this.namespace, ' event: ', event)
    
            const thisIo = this.io
    
            return thisIo.emit(event, data);
        }).catch(() => {
            console.error('not connected to namespace: ', this.namespace);
        })

    }
}

export default SocketsConnectionHandler;