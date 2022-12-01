import { UnsuccssesRequest } from 'core/TransportLayer/types';

export function isSuccessRequest<T extends Record<string, any>>(
	req: T | UnsuccssesRequest
): req is T {
	return typeof req?.error === 'undefined';
}
