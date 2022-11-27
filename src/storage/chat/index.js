import {
    makeAutoObservable, runInAction, toJS,
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

        this.transportLayer.createWsConnection('chat');

        this.startGetOnlineDialogs();
    }

    changeCurrentDialog(uuid) {
        this.currentDialog = uuid;
        this.dialogMessagesState = ChatStates.unfetched;

        this.messages = [];

        if (uuid !== null) {
            runInAction(() => { this.getDialogMessages(uuid) });
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

        const { data } = await this.transportLayer.getDialogMessages({
            limit,
            offset,
            hash: uuid
        });

        return runInAction(() => {
            this.dialogMessagesState = ChatStates.fectched;

            data.forEach((msg) => {
                this.updateMessageFromServer(msg);
            })

            this.messages = this.messages.sort((hash1, hash2) => {
                return this.messagesByHash[hash2].createdAt - this.messagesByHash[hash1].createdAt;
            })

            return true;
        })
    }

    //TO-DO
    partialUpdateDialogFromServer(dialog) {
        const {
            uuid,
            ...data
        } = dialog;

        const currentData = this.dialogsByHash[uuid];

        this.dialogsByHash[uuid] = { ...currentData, ...data };
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
            isTyping: !!dialog.isTyping,
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
            this.updateChatUser(user);
        })
    }

    updateChatUser(user) {
        console.log(user)
        this.dialogsUsersData[user.hash] = { ...this.dialogsUsersData[user.hash], ...user };
    }

    updateMessageFromServer(message) {
        const {
            uuid,
            sender,
            ...data
        } = message;

        const messageData = {
            ...data,
            sender: sender ? sender.hash : null,
            createdAt: new Date(message.createdAt),
            updatedAt: new Date(message.updatedAt),
        }

        if (this.messagesByHash[uuid]) {
            this.messagesByHash[uuid] = {
                ...this.messagesByHash[uuid],
                ...messageData
            }

            if (!this.messages.includes(uuid)) {
                this.messages.unshift(uuid);
            }

        } else {
            this.messagesByHash[uuid] = messageData;
            this.messages.unshift(uuid);
        }
    }

    async sendMessageToDialog(chatUUID, message) {
        return runInAction(() => {
            this.transportLayer.wsSendMessageToDialog({ 
                data: {
                    message,
                    uuid: chatUUID,
                }
            })
        });
    }

    userTyping(dialogUUID) {
        this.transportLayer.wsSendUserTyping({
            data: { dialogUUID }
        })
    }

    startGetOnlineDialogs() {
        const onlineIntreval = 5000;

        const stopId = setInterval(async () => {
            let userHashes = Object.getOwnPropertyNames(this.dialogsUsersData);

            await this.transportLayer.wsGetDialogsMetadata({
                data: {
                    onlineUsers: userHashes,
                }
            });
        }, onlineIntreval)

        return () => { clearInterval(stopId) }
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