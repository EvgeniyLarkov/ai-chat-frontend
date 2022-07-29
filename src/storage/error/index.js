import { makeAutoObservable } from 'mobx';

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
            code = error.status;
        }

        this.errors = [{
            name,
            description,
            code
        }, ...this.errors];
    }
}

export default ErrorStore;