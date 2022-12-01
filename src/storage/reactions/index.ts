import {WsNamespaces} from 'core/TransportLayer/types';
import {makeAutoObservable} from 'mobx';
import type Chat from 'storage/chat';
import ChatReactions from './chat';

export type ServerToClientEvents = InstanceType<typeof Reactions>['byNamespace'];

class Reactions {
    chatStorage: Chat;
    
    chatReactions: ChatReactions;

    byNamespace: { [WsNamespaces.chat]: InstanceType<typeof ChatReactions>['byName']; }

	constructor(chatStorage: Chat) {
		makeAutoObservable(this);

		this.chatStorage = chatStorage;

        this.chatReactions = new ChatReactions(this.chatStorage);

        this.byNamespace[WsNamespaces.chat] = this.chatReactions.byName;
	}
}

export default Reactions;
