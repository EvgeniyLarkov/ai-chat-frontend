import { makeAutoObservable, runInAction } from "mobx";

class Reactions {
    constructor(transportLayer, chatStorage) {
        makeAutoObservable(this)

        this.transportLayer = transportLayer;
        this.chatStorage = chatStorage;

        this.applyChatReactions();
    }

    applyChatReactions() {
        const namespace = 'chat';

        this.transportLayer.addReaction('message', namespace, (data) => {
            console.log('recieved reaction on message in namespace ', namespace)
            runInAction(() => this.chatStorage.updateMessageFromServer(data));
        })

        this.transportLayer.addReaction('dialog-metadata', namespace, (data) => {
            runInAction(() => {
                if (!data.onlineUsers) {
                    return;
                }               

                data.onlineUsers.forEach((user) => {
                    this.chatStorage.updateChatUser(user);
                })
            })
        })

        this.transportLayer.addReaction('chat-user-typing', namespace, (data) => {
            const { dialogUUID, userHash } = data;

            this.chatStorage.partialUpdateDialogFromServer({
                uuid: dialogUUID,
                isTyping: true,
            });

            runInAction(() => {   
                // TO-DO
                setTimeout(() => {
                    this.chatStorage.partialUpdateDialogFromServer({
                        uuid: dialogUUID,
                        isTyping: false,
                    });
                }, 5000)
            })
        })

    }
}

export default Reactions;