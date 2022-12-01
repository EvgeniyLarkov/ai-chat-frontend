import { type UserDto } from 'storage/user/types';
import { type ChatLastMessageDto } from './chat-last.dto';
import { type ChatMessageDto } from './chat-message.dto';

export type ChatDialogDto = {
	id: number;

	uuid: string;

	name: string;

	participants: UserDto[];

	messages: ChatMessageDto[];

	__last__?: ChatLastMessageDto;

	createdAt: string;

	updatedAt: string;

	deletedAt?: string;

	isTyping?: boolean;
};
