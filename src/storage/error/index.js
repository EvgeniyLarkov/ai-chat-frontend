import { makeAutoObservable } from 'mobx';

import { isDevelopment } from '../../utils';

class ErrorStore {
    errors = [];

    constructor() {
        makeAutoObservable(this);
    }

    add(error) {
        let name = '';
        let description = '';
        let code = null;

        if (!error.response) {
            name = 'Unknown error';
            description = 'Something go wrong';
        } else {
            name = error.response.statusText;
            description = error.response.statusText;
            code = error.response.status;
        }

        if (error.response?.data?.errors) {
            const allErrors = error.response.data.errors;
            description = [];

            for (let errorKey in allErrors) {
                const errorText = `${errorKey}: ${allErrors[errorKey]}`
                description = [...description, errorText]; 
            }

            description.join(', ');
        }

        const normalizedError = {
            name,
            description,
            code
        };

        if(isDevelopment()) {
            console.log(error, normalizedError);
        }

        this.errors = [{
            name,
            description,
            code
        }, ...this.errors];
    }
}

export default ErrorStore;