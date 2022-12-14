import { type UserDto } from 'storage/user/types';

export type UserLoginResponse = {
	token: string;
	user: UserDto;
};

export type UserRegisterResponse = {
	status: number;
};

export type UserUploadFileResponse = {
	path: string;
	uuid: string;
	id?: number;
};

export type UserUpdateInfoResponse = UserDto;
