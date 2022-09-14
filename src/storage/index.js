import AuthProvider from '../core/AuthProvider';
import TransportLayer from '../core/TransportLayer';
import Chat from './chat';
import ErrorStore from './error';
import UI from './ui';
import User from './user';

class RootStorage {
    constructor() {
        this.errorsHandler = new ErrorStore();
        this.authProvider = new AuthProvider();
        this.transportLayer = new TransportLayer(this.errorsHandler, this.authProvider);

        this.chatStorage = new Chat(this.transportLayer);
        this.userStorage = new User(this.transportLayer, this.authProvider);
        this.UIStorage = new UI();
    }
}

export default RootStorage;