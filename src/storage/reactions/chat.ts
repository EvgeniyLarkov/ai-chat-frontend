import { WsNamespaces, WsServerChatEvents } from "core/TransportLayer/types";
import { makeAutoObservable, runInAction } from "mobx";
import Chat from "storage/chat";
import { ChatDialogDto } from "storage/chat/types/chat-dialog.dto";
import { ChatMessageDto } from "storage/chat/types/chat-message.dto";
import { UserDto } from "storage/user/types";

class ChatReactions {
    namespace = WsNamespaces.chat;
    chatStorage: Chat;
    
    byName: {
        [WsServerChatEvents.message]: InstanceType<typeof ChatReactions>['handleMessageReaction'];
        [WsServerChatEvents.getOnline]: InstanceType<typeof ChatReactions>['handleIsOnlineReaction'];
        [WsServerChatEvents.typing]: InstanceType<typeof ChatReactions>['handleTypingReaction'];
    };

	constructor(chatStorage: Chat) {
		makeAutoObservable(this);
		this.chatStorage = chatStorage;

        this.byName[WsServerChatEvents.message] = this.handleMessageReaction;
        this.byName[WsServerChatEvents.getOnline] = this.handleIsOnlineReaction;
        this.byName[WsServerChatEvents.typing] = this.handleTypingReaction;
	}

    handleMessageReaction (data: ChatMessageDto) {
        runInAction(() => this.chatStorage.updateMessageFromServer(data));
    }

    handleIsOnlineReaction (data: { onlineUsers?: { hash: UserDto['hash']; isOnline: boolean;}[] }) {
        runInAction(() => {
            if (!data.onlineUsers) {
                return;
            }

            data.onlineUsers.forEach(user => {
                this.chatStorage.updateChatUser(user);
            });
        });
    }

    handleTypingReaction (data: { dialogUUID: ChatDialogDto['uuid']; userHash: UserDto['hash'] }) {
        const {dialogUUID } = data;

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
            }, 5000);
        });
    }
}

export default ChatReactions;