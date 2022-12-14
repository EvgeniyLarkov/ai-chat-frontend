import type AuthProvider from 'core/AuthProvider';
import { makeAutoObservable, toJS } from 'mobx';
import { io, Socket } from 'socket.io-client';
import { EventNames } from '@socket.io/component-emitter';
import { EventsMap } from 'socket.io/dist/typed-events';
import Reactions from 'storage/reactions';
import { serverHost, serverPort } from './config';
import { WsEmitRequestOptions, WsNamespaces } from './types';

enum ConnectionStates {
	connecting = 'connecting',
	connected = 'connected',
	unconnected = 'unconnected',
}

class SocketsConnectionHandler<
	ServerToClients extends EventsMap,
	ClientsToServer extends EventsMap
> {
	serverHost = serverHost;

	serverPort = serverPort;

	authProvider: AuthProvider;

	reactionsHandler: Reactions;

	namespace: WsNamespaces;

	state = ConnectionStates.unconnected;

	connectionPromise: Promise<void>;

	io: Socket<ServerToClients, ClientsToServer>;

	constructor(
		authProvider: AuthProvider,
		namespace: WsNamespaces,
		reactionHandler: Reactions
	) {
		makeAutoObservable(this);

		this.authProvider = authProvider;
		this.namespace = namespace;
		this.reactionsHandler = reactionHandler;

		const connection: Socket<ServerToClients, ClientsToServer> = io(
			`http://${this.serverHost}:${this.serverPort}/${namespace}`,
			{
				extraHeaders: {
					Authorization: `Bearer ${this.authProvider.token}`,
				},
			}
		);

		this.io = connection;
		console.log('started connection to namespasce: ', this.namespace);

		this.state = ConnectionStates.connecting;

		this.connectionPromise = new Promise((res, rej) => {
			this.io.on('connect', () => {
				res();
				this.handleConnection();
			});

			this.io.on('disconnect', () => {
				rej();
				this.handleDisconnection();
			});
		});

		// const reactions = this.reactionsHandler.byNamespace[namespace];
		// const eventNames = Object.getOwnPropertyNames(reactions);

		// eventNames.forEach((eventName) => {
		// 	this.addReaction(eventName, reactions[eventName]);
		// });
	}

	handleConnection() {
		this.state = ConnectionStates.connected;

		console.log('connected to namespasce: ', this.namespace);

		const reactions = this.reactionsHandler.byNamespace[
			this.namespace
		] as unknown as ServerToClients;
		const eventNames = Object.getOwnPropertyNames(
			reactions
		) as unknown as Array<keyof ServerToClients>;

		eventNames.forEach((eventName) => {
			const reaction = reactions[eventName];

			this.io.on(eventName as unknown as any, (data) => {
				const bindedReaction = reaction.bind(this.reactionsHandler);
				bindedReaction(data);
			});
		});
	}

	handleDisconnection() {
		this.state = ConnectionStates.unconnected;

		console.log('disconnected from namespasce: ', this.namespace);
	}

	// addReaction(
	// 	eventName: keyof ServerToClients,
	// 	reaction: ServerToClients[typeof eventName]
	// ) {
	// 	console.log(
	// 		`applied reaction on ${String(eventName)} in namespace ${this.namespace}`
	// 	);
	// 	this.reactions[eventName] = reaction;
	// }

	emit<T>(options: WsEmitRequestOptions<T>) {
		this.connectionPromise
			.then(() => {
				const { event, data } = options;

				console.log(
					'emit to namespasce: ',
					this.namespace,
					' event: ',
					event,
					'data:',
					data
				);

				const thisIo = this.io;

				return thisIo.emit(
					event as unknown as EventNames<ClientsToServer>,
					...([data] as unknown as Parameters<
						ClientsToServer[EventNames<ClientsToServer>]
					>) // TO-DO
				);
			})
			.catch(() => {
				console.error('not connected to namespace: ', this.namespace);
			});
	}
}

export default SocketsConnectionHandler;
