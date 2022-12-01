import {
	type EndpointObject,
	type EndpointParameters,
	WsChatEvents,
	WsNamespaces,
	type WsEndpointObject,
} from './types';

const endpoints: Record<string, EndpointObject> = {
	userLogin: { url: () => 'auth/email/login', method: 'POST' },
	userRegister: { url: () => 'auth/email/register', method: 'POST' },

	createDialog: { url: () => 'chat', method: 'POST' },
	getDialogs: {
		url: ({ limit = 20, offset = 0 }: EndpointParameters) =>
			`chat?limit=${limit}&offset=${offset}`,
		method: 'GET',
	},
	getDialog: {
		url: ({ hash }: EndpointParameters) => `chat/${hash}`,
		method: 'GET',
	},
	getDialogMessages: {
		url: ({ hash, limit = 50, offset = 0 }: EndpointParameters) =>
			`chat/${hash}/messages?limit=${limit}&offset=${offset}`,
		method: 'GET',
	},
	postDialogMessage: {
		url: ({ hash }: EndpointParameters) => `chat/${hash}`,
		method: 'POST',
	},
};

export const wsEndpoints: Record<string, WsEndpointObject> = {
	sendDialogMessage: {
		url: () => '',
		namespace: WsNamespaces.chat,
		event: WsChatEvents.message,
	},
	getDialogMetadata: {
		url: () => '',
		namespace: WsNamespaces.chat,
		event: WsChatEvents.getOnline,
	},
	userTyping: {
		url: () => '',
		namespace: WsNamespaces.chat,
		event: WsChatEvents.typing,
	},
};

export default endpoints;
