import { UnsuccssesRequest } from 'core/TransportLayer/types';
import { makeAutoObservable } from 'mobx';
import { transformError } from 'utils/transformError';

class ErrorStore {
	errors: UnsuccssesRequest[] = [];

	constructor() {
		makeAutoObservable(this);
	}

	add(rawError: unknown) {
		const error = transformError(rawError);

		this.errors = [error, ...this.errors];
	}
}

export default ErrorStore;
