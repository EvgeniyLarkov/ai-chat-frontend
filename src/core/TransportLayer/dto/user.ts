import {type UserDto} from 'storage/user/types';

export type UserLoginResponse = {
	token: string;
	user: UserDto;
};
