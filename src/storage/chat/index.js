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

        const response = await this.transportLayer.getChatDialogs();

        return runInAction(() => {
            this.allDialogsState = ChatEntitiesStates.fectched;

            response.forEach((dialog) => {
                this.updateDialogFromServer(dialog);
            })

            return true;
        })
    }

    updateDialogFromServer(dialog) {
        const {
            uuid,
            ...data
        } = dialog;

        if (this.dialogsByHash[uuid]) {
            this.dialogsByHash[uuid] = {
                ...this.dialogsByHash[uuid],
                ...data
            }
        } else {
            this.dialogsByHash[uuid] = data;
            this.dialogs.push(uuid);
        }       
    }

    getDialogData(uuid) {
        return this.dialogsByHash[uuid];
    }
}

export default Chat;