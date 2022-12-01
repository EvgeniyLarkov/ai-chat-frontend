import {type UserDto} from 'storage/user/types';

export type ChatMessage = {
	uuid: string;
	message: string;
	readed: boolean;
	createdAt: Date;
	updatedAt: Date;
	sender?: UserDto['hash'];
};
