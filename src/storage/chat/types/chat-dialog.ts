import {type UserDto} from 'storage/user/types';
import {type ChatDialogDto} from './chat-dialog.dto';

export type ChatDialog = {
	uuid: ChatDialogDto['uuid'];
	name: string;
	logo: string;
	participants: Array<UserDto['hash']>;
	updatedAt: Date;
	messageUuid?: string;
	isTyping?: boolean;
};
