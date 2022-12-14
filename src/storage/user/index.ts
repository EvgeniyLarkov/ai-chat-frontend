import type AuthProvider from 'core/AuthProvider';
import type TransportLayer from 'core/TransportLayer';
import { request } from 'http';
import { makeAutoObservable, runInAction } from 'mobx';

import { isSuccessRequest } from '../../utils/requestHelper';
import {
	UserDto,
	UserLocaleData,
	UserLoginData,
	UserRegisterData,
	UserUpdateInfoData,
} from './types';

export enum UserLoginStates {
	logined = 'logined',
	unlogined = 'unlogined',
	pending = 'pending',
}

function userDtoToLocaleData(user: UserDto): UserLocaleData {
	const result: UserLocaleData = {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		hash: user.hash,
		photo: user.photo?.path || null,
	};

	return result;
}

class User {
	authProvider: AuthProvider;

	transportLayer: TransportLayer;

	state = UserLoginStates.unlogined;

	name: UserDto['firstName'] | null = null;

	lastName: UserDto['lastName'] | null = null;

	email: UserDto['email'] | null = null;

	id: UserDto['id'] | null = null;

	photo: string | null = null;

	hash: UserDto['hash'] | null = null;

	constructor(transportLayer: TransportLayer, authProvider: AuthProvider) {
		makeAutoObservable(this);
		this.authProvider = authProvider;
		this.transportLayer = transportLayer;

		if (this.authProvider.token) {
			const userData = this.authProvider.getLocalUserData();

			if (userData) {
				this.setUserData(userData);
			}
		}
	}

	setUserData(user: UserLocaleData) {
		this.state = UserLoginStates.logined;

		this.id = user.id;
		this.email = user.email;
		this.name = user.firstName;
		this.lastName = user.lastName;
		this.hash = user.hash;
		this.photo = user.photo || null;
	}

	updateUserDataFromServer(user: Partial<UserDto>) {
		this.email = user.email ? user.email : this.email;
		this.name = user.firstName ? user.firstName : this.name;
		this.lastName = user.lastName ? user.lastName : this.lastName;
		this.photo = user.photo ? user.photo.path : this.photo;
	}

	async login(data: UserLoginData) {
		this.state = UserLoginStates.pending;
		const response = await this.transportLayer.loginUser(data);

		return runInAction(() => {
			if (!isSuccessRequest(response)) {
				this.state = UserLoginStates.unlogined;
				return response;
			}

			const { token, user } = response;

			const localeData = userDtoToLocaleData(user);

			this.setUserData(localeData);

			this.authProvider.setToken(token);
			this.authProvider.saveLocalUserData(localeData);

			return isSuccessRequest(response);
		});
	}

	async updateUserData(data: UserUpdateInfoData) {
		const response = await this.transportLayer.updateUserInfo({ data });

		return runInAction(() => {
			if (!isSuccessRequest(response)) {
				return response;
			}

			this.updateUserDataFromServer(response);

			return response;
		});
	}

	async uploadFile(data: File) {
		const response = await this.transportLayer.uploadUserFile({ file: data });

		return response;
	}

	async register(data: UserRegisterData) {
		const response = await this.transportLayer.registerUser(data);

		return response;
	}

	logout() {
		this.state = UserLoginStates.unlogined;
		this.name = null;
		this.lastName = null;
		this.id = null;
		this.email = null;
		this.photo = null;

		this.authProvider.clearUserData();
	}
}

export default User;
