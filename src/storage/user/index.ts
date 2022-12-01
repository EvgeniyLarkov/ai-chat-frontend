import type AuthProvider from 'core/AuthProvider';
import type TransportLayer from 'core/TransportLayer';
import { makeAutoObservable, runInAction } from 'mobx';

import { isSuccessRequest } from '../../utils/requestHelper';
import { UserDto, UserLocaleData, UserLoginData } from './types';

enum UserLoginStates {
	logined = 'logined',
	unlogined = 'unlogined',
	pending = 'pending',
}

class User {
	authProvider: AuthProvider;

	transportLayer: TransportLayer;

	state = UserLoginStates.unlogined;

	name: UserDto['firstName'] | null = null;

	email: UserDto['email'] | null = null;

	id: UserDto['id'] | null = null;

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
		this.hash = user.hash;
	}

	async login(data: UserLoginData) {
		this.state = UserLoginStates.pending;
		const response = await this.transportLayer.loginUser(data);

		return runInAction(() => {
			if (!isSuccessRequest(response)) {
				this.state = UserLoginStates.unlogined;
				return isSuccessRequest(response);
			}

			const { token, user } = response;

			this.setUserData(user);

			this.authProvider.setToken(token);
			this.authProvider.saveLocalUserData(user);

			return isSuccessRequest(response);
		});
	}

	async register(data) {
		const response = await this.transportLayer.registerUser(data);

		return response;
	}

	unlogin() {
		this.state = UserLoginStates.unlogined;
		this.name = null;
		this.id = null;
		this.email = null;

		this.authProvider.clearUserData();
	}
}

export default User;
