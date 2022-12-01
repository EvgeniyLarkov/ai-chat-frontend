import {type UserDto} from 'storage/user/types';

export type ChatMessageDto = {
	uuid: string;
	message: string;
	readed: boolean;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
	sender?: UserDto;
};
