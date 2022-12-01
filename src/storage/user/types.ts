type UserEmail = string;
export type UserHash = string;

export enum UserRoles {
	'User' = 'User',
	'Admin' = 'Admin',
}

export enum UserStatus {
	'Inactive' = 'Inactive',
	'Active' = 'Active',
}

export type UserDto = {
	id: number;
	email: UserEmail;
	provider: string;
	socialId: undefined | number;
	firstName: string;
	lastName: string;
	hash: UserHash;
	createdAt: string;
	updatedAt: string;
	deletedAt: undefined | string;
	photo: undefined | string;
	isOnline?: boolean;
	role: {
		id: number;
		name: UserRoles;
	};
	status: {
		id: number;
		name: UserStatus;
	};
};

export type UserLoginData = Pick<UserDto, 'email'> & {
	password: string;
};

export type UserLocaleData = Pick<
	UserDto,
	'id' | 'email' | 'firstName' | 'hash'
>;
