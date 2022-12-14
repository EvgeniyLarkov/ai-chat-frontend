import { UserDto } from 'storage/user/types';

export type FileDto = {
	id: number;
	path: string;
	uuid: string;
	user?: UserDto; // TO-DO
};
