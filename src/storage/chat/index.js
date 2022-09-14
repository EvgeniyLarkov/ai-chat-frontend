import {
    makeAutoObservable, runInAction,
} from 'mobx';
import { isSuccessRequest, isUnsuccessRequest } from '../../utils/requestHelper';

export const ChatEntitiesStates = {
    unfetched: 'unfetched',
    fectched: 'fetched',
    pending: 'pending',
}


class Chat {
    allDialogsState = ChatEntitiesStates.unfetched;

    dialogs = [];
    dialogsByHash = {};
    messagesByHash = {};
    messages = [];

    constructor(transportLayer) { 
        makeAutoObservable(this)

        this.transportLayer = transportLayer;
    }

    async getChatDialogs() {
        this.allDialogsState = ChatEntitiesStates.pending;

        const response = this.transportLayer.getChatDialogs();

        return runInAction(() => {
            this.allDialogsState = ChatEntitiesStates.fectched;

            if (isUnsuccessRequest(response)) {
                return isSuccessRequest(response);
            }
    
            console.log(response);
    
            return isSuccessRequest(response);
        })
    }
}

export default Chat;