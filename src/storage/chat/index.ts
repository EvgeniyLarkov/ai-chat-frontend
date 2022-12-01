/* eslint-disable no-underscore-dangle */
import type TransportLayer from 'core/TransportLayer';
import { WsNamespaces } from 'core/TransportLayer/types';
import { makeAutoObservable, runInAction } from 'mobx';
import { UserDto } from 'storage/user/types';
import { isSuccessRequest } from 'utils/requestHelper';
import { ChatDialog } from './types/chat-dialog';
import { ChatDialogDto } from './types/chat-dialog.dto';
import { ChatMessage } from './types/chat-message';
import { ChatMessageDto } from './types/chat-message.dto';

export enum ChatStates {
	unfetched = 'unfetched',
	fectched = 'fetched',
	pending = 'pending',
}

type DialogsByHash = {
	[key: ChatDialog['uuid']]: ChatDialog;
};

type MessagesByHash = {
	[key: ChatMessage['uuid']]: ChatMessage;
};

type DialogUsersByHash = {
	[key: UserDto['hash']]: UserDto;
};

type CurrentChatDialog = ChatDialog['uuid'] | null;

class Chat {
	transportLayer: TransportLayer;

	allDialogsState = ChatStates.unfetched;

	dialogMessagesState = ChatStates.unfetched;

	currentDialog: CurrentChatDialog = null;

	dialogs: ChatDialog['uuid'][] = []; // dialogs order

	dialogsByHash: DialogsByHash = {};

	dialogsUsersData: DialogUsersByHash = {};

	messagesByHash: MessagesByHash = {};

	messages: ChatMessage['uuid'][] = []; // Messages order

	constructor(transportLayer: TransportLayer) {
		makeAutoObservable(this);

		this.transportLayer = transportLayer;

		this.transportLayer.createWsConnection(WsNamespaces.chat);

		this.startGetOnlineDialogs();
	}

	changeCurrentDialog(uuid: ChatDialog['uuid']) {
		this.currentDialog = uuid;
		this.dialogMessagesState = ChatStates.unfetched;

		this.messages = [];

		if (uuid !== null) {
			runInAction(() => {
				this.getDialogMessages(uuid);
			});
		}
	}

	async getChatDialogs(): Promise<void> {
		this.allDialogsState = ChatStates.pending;

		const response = await this.transportLayer.getChatDialogs();

		if (!isSuccessRequest(response)) {
			return;
		}

		runInAction(() => {
			this.allDialogsState = ChatStates.fectched;

			response.forEach((dialog) => {
				this.updateDialogFromServer(dialog);
			});
		});
	}

	async getDialogMessages(uuid: ChatMessage['uuid'], offset = 0, limit = 50) {
		// TO-DO
		this.dialogMessagesState = ChatStates.pending;

		const messages = await this.transportLayer.getDialogMessages({
			limit,
			offset,
			hash: uuid,
		});

		if (!isSuccessRequest(messages)) {
			return;
		}

		runInAction(() => {
			this.dialogMessagesState = ChatStates.fectched;

			messages.forEach((msg) => {
				this.updateMessageFromServer(msg);
			});

			this.messages = this.messages.sort(
				(hash1, hash2) =>
					(this.messagesByHash[hash2]?.createdAt.getTime() || 0) -
					(this.messagesByHash[hash1]?.createdAt.getTime() || 0)
			);

			return true;
		});
	}

	// TO-DO
	partialUpdateDialogFromServer(
		dialog: Pick<ChatDialogDto, 'uuid'> & Partial<ChatDialogDto>
	) {
		const { uuid, ...data } = dialog;

		const currentData = this.dialogsByHash[uuid];

		const updateObject = {
			...data,
			uuid,
			updatedAt: data.updatedAt
				? new Date(data.updatedAt)
				: currentData.updatedAt,
			participants:
				data.participants?.map((user) => user.hash) || currentData.participants,
			messageUuid: dialog.__last__?.messageUuid || currentData.messageUuid,
		};

		if (this.dialogsByHash[uuid]) {
			this.dialogsByHash[uuid] = { ...currentData, ...updateObject };
		}
	}

	updateDialogFromServer(dialog: ChatDialogDto) {
		const { uuid } = dialog;

		const mappedDialog: ChatDialog = {
			uuid,
			name: dialog.name,
			logo: '', // TO-DO
			participants: dialog.participants.map((user) => user.hash),
			updatedAt: new Date(dialog.updatedAt),
			messageUuid: dialog.__last__?.messageUuid,
			isTyping: Boolean(dialog.isTyping),
		};

		if (dialog.__last__) {
			const message = dialog.__last__;

			const mappedMessage = {
				message: message.userMessage,
				sender: dialog.participants.find(
					({ hash }) => hash === message.userHash
				),
				dialogUuid: message.dialogUuid,
				uuid: message.messageUuid,
				readed: message.messageReaded,
				createdAt: message.createdAt,
				updatedAt: message.updatedAt,
			};

			this.updateMessageFromServer(mappedMessage);
		}

		if (this.dialogsByHash[uuid]) {
			this.dialogsByHash[uuid] = {
				...this.dialogsByHash[uuid],
				...mappedDialog,
			};
		} else {
			this.dialogsByHash[uuid] = mappedDialog;
			this.dialogs.push(uuid);
		}

		dialog.participants.forEach((user) => {
			this.updateChatUser(user);
		});
	}

	updateChatUser(user: Pick<UserDto, 'hash'> & Partial<UserDto>) {
		if (this.dialogsUsersData[user.hash]) {
			this.dialogsUsersData[user.hash] = {
				...this.dialogsUsersData[user.hash],
				...user,
			};
		}
	}

	updateMessageFromServer(message: ChatMessageDto) {
		const { uuid, sender, ...data } = message;

		const messageData: ChatMessage = {
			...data,
			uuid,
			sender: sender?.hash,
			createdAt: new Date(message.createdAt),
			updatedAt: new Date(message.updatedAt),
		};

		if (this.messagesByHash[uuid]) {
			this.messagesByHash[uuid] = {
				...this.messagesByHash[uuid],
				...messageData,
			};

			if (!this.messages.includes(uuid)) {
				this.messages.unshift(uuid);
			}
		} else {
			this.messagesByHash[uuid] = messageData;
			this.messages.unshift(uuid);
		}
	}

	async sendMessageToDialog(chatUUID: ChatDialog['uuid'], message: string) {
		runInAction(() => {
			this.transportLayer.wsSendMessageToDialog({
				data: {
					message,
					uuid: chatUUID,
				},
			});
		});
	}

	userTyping(dialogUUID: ChatDialog['uuid']) {
		this.transportLayer.wsSendUserTyping({
			data: { dialogUUID },
		});
	}

	startGetOnlineDialogs() {
		const onlineIntreval = 5000;

		const stopId = setInterval(async () => {
			const userHashes = Object.getOwnPropertyNames(this.dialogsUsersData);

			await this.transportLayer.wsGetDialogsMetadata({
				data: {
					onlineUsers: userHashes,
				},
			});
		}, onlineIntreval);

		return () => {
			clearInterval(stopId);
		};
	}

	getDialogData(uuid: ChatDialog['uuid']) {
		return this.dialogsByHash[uuid];
	}

	getMessageData(uuid: ChatMessage['uuid']) {
		return this.messagesByHash[uuid];
	}

	getChatUserData(hash: UserDto['hash']) {
		return this.dialogsUsersData[hash];
	}
}

export default Chat;
