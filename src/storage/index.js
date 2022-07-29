import TransportLayer from '../core/TransportLayer';
import ErrorStore from './error';
import UI from './ui';
import User from './user';

class RootStorage {
    constructor() {
        this.errorsHandler = new ErrorStore();
        this.transportLayer = new TransportLayer(this.errorsHandler);

        this.userStorage = new User(this.transportLayer);
        this.UIStorage = new UI();
    }
}

export default RootStorage;