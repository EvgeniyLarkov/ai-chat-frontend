import {
    makeAutoObservable, runInAction,
} from 'mobx';

export const ChatStates = {
    unfetched: 'unfetched',
    fectched: 'fetched',
    pending: 'pending',
}


class Chat {
    allDialogsState = ChatStates.unfetched;
    dialogMessagesState = ChatStates.unfetched;

    currentDialog = null;
    dialogs = []; //dialogs order
    dialogsByHash = {};
    dialogsUsersData = {};
    messagesByHash = {};
    messages = []; // Messages order

    constructor(transportLayer) {
        makeAutoObservable(this)

        this.transportLayer = transportLayer;
    }

    changeCurrentDialog(uuid) {
        this.currentDialog = uuid;
        this.dialogMessagesState = ChatStates.unfetched;

        this.messages = [];

        if (uuid !== null) {
            this.getDialogMessages(uuid);
        }
    }

    async getChatDialogs() {
        this.allDialogsState = ChatStates.pending;

        const response = await this.transportLayer.getChatDialogs();

        return runInAction(() => {
            this.allDialogsState = ChatStates.fectched;

            response.forEach((dialog) => {
                this.updateDialogFromServer(dialog);
            })

            return true;
        })
    }

    async getDialogMessages(uuid, offset = 0, limit = 50) { // TO-DO
        this.dialogMessagesState = ChatStates.pending;

        const response = await this.transportLayer.getDialogMessages({
            limit,
            offset,
            hash: uuid
        });

        return runInAction(() => {
            this.dialogMessagesState = ChatStates.fectched;

            response.forEach((msg) => {
                this.updateMessageFromServer(msg);
            })

            return true;
        })
    }

    updateDialogFromServer(dialog) {
        const {
            uuid,
            ...data
        } = dialog;

        const mappedDialog = {
            uuid,
            name: dialog.name,
            logo: dialog.logo,
            participants: dialog.participants.map((user) => user.hash),
            updatedAt: dialog.uuid,
            messageUuid: dialog.__last__ ? dialog.__last__.messageUuid : null,
        }

        if (dialog.__last__) {
            const message = dialog.__last__;

            const mappedMessage = {
                "message": message.userMessage,
                "senderUuid": message.userHash,
                "dialogUuid": message.dialogUuid,
                "uuid": message.messageUuid,
                "readed": message.messageReaded,
                "createdAt": message.createdAt,
                "updatedAt": message.updatedAt
            }

            this.updateMessageFromServer(mappedMessage);
        }

        if (this.dialogsByHash[uuid]) {
            this.dialogsByHash[uuid] = {
                ...this.dialogsByHash[uuid],
                ...mappedDialog
            }
        } else {
            this.dialogsByHash[uuid] = mappedDialog;
            this.dialogs.push(uuid);
        }

        dialog.participants.forEach((user) => {
            this.dialogsUsersData[user.hash] = user;
        })
    }

    updateMessageFromServer(message) {
        const {
            uuid,
            ...data
        } = message;

        if (this.messagesByHash[uuid]) {
            this.messagesByHash[uuid] = {
                ...this.messagesByHash[uuid],
                ...data
            }
        } else {
            this.messagesByHash[uuid] = data;
            this.messages.push(uuid);
        }
    }

    getDialogData(uuid) {
        return this.dialogsByHash[uuid] || {};
    }

    getMessageData(uuid) {
        return this.messagesByHash[uuid] || {};
    }

    getChatUserData(uuid) {
        return this.dialogsUsersData[uuid] || {};
    }
}

export default Chat;