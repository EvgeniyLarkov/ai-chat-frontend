import { AxiosError } from 'axios';

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
		[eventKey in WsChatEvents]: (data: any) => void;
	};
};

export type RequestOptions<T> = RequestData<T> & EndpointParameters;
export type WsRequestOptions<T> = RequestData<T>;
export type WsEmitRequestOptions<T> = RequestData<T> &
	Pick<WsEndpointObject, 'event'>;
export type RequestFileOptions<T> = {
	file: string | Blob;
	data?: T;
} & EndpointParameters;

interface IErrorBase<T> {
	error: Error | AxiosError<T>;
	type: 'axios-error' | 'stock-error' | 'server-error';
}

export enum IErrorTypes {
	'request' = 'axios-error',
	'response' = 'server-error',
	'internal' = 'stock-error',
}

export interface IAxiosError<T> extends IErrorBase<T> {
	error: AxiosError<T>;
	type: IErrorTypes.request;
}

export interface IServerError<T> extends IErrorBase<T> {
	error: AxiosError<T>;
	type: IErrorTypes.response;
}

export interface IStockError<T> extends IErrorBase<T> {
	error: Error;
	type: IErrorTypes.internal;
}

export type UnsuccssesRequest = {
	error: IErrorTypes;
	message: string;
	data?: {
		errors?: Record<string, string>;
		status: number;
	};
};

export type ResponseWithPagination<T> = {
	data: T;
	hasNextPage: boolean;
};
