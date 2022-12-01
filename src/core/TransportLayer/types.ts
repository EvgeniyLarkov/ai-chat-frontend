export type EndpointParameters = {
	limit?: number;
	offset?: number;
	hash?: string;
};

export type EndpointObject = {
	url: (data: undefined | EndpointParameters) => string;
	method: string;
};

export type WsEndpointObject = {
	url: () => string;
	namespace: WsNamespaces;
	event: WsChatEvents;
};

export enum WsNamespaces {
	chat = 'chat',
}

export enum WsChatEvents {
	message = 'message',
	getOnline = 'dialog-metadata',
	typing = 'user-typing',
}

export enum WsServerChatEvents {
	message = 'message',
	getOnline = 'dialog-metadata',
	typing = 'user-typing',
}

export type WsServerChatEventsByNamespace = {
	[WsNamespaces.chat]: WsServerChatEvents;
};

export type RequestData<T> = {
	data?: T;
};

export type ClientsToServerEvents = {
	[key in WsNamespaces]: {
		[key in WsChatEvents]: (data: any) => void;
	}
};

export type RequestOptions<T> = RequestData<T> & EndpointParameters;
export type WsRequestOptions<T> = RequestData<T>
export type WsEmitRequestOptions<T> = RequestData<T> & Pick<WsEndpointObject, 'event'>;
