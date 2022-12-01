import {type UserDto} from 'storage/user/types';
import {type ChatDialogDto} from './chat-dialog.dto';
import {type ChatMessageDto} from './chat-message.dto';

export type ChatLastMessageDto = {
	dialogUuid: ChatDialogDto['uuid'];
	userHash: UserDto['hash'];
	userMessage: string;
	messageUuid: ChatMessageDto['uuid'];
	messageReaded: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
};
