import React from 'react';
import AuthProvider from '../core/AuthProvider';
import TransportLayer from '../core/TransportLayer';
import Chat from './chat';
import ErrorStore from './error';
import Reactions from './reactions';
import UI from './ui';
import ChatUIState from './ui/chat';
import User from './user';

class RootStorage {
    constructor() {
        this.errorsHandler = new ErrorStore();
        this.authProvider = new AuthProvider();
        this.transportLayer = new TransportLayer(this.errorsHandler, this.authProvider);

        this.chat = new Chat(this.transportLayer);
        this.userStorage = new User(this.transportLayer, this.authProvider);
        this.UIStorage = new UI();
        this.chatUI = new ChatUIState();

        this.reactionsHandler = new Reactions(this.transportLayer, this.chat);
    }
}

const StoreContext = React.createContext(null);
 
export const StoreProvider = ({ children, store }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
 
export const useStore = () => React.useContext(StoreContext);

export default RootStorage;