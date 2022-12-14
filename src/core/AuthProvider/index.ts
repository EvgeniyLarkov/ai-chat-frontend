import { computed, makeAutoObservable } from 'mobx';
import { UserDto, type UserLocaleData } from 'storage/user/types';

class AuthProvider {
	token: string | null = null;

	tokenName = 'jwt_auth_token';

	userDataName = 'user_data';

	constructor() {
		makeAutoObservable(this, {
			getToken: computed,
		});
		const token = localStorage.getItem(this.tokenName);

		if (token) {
			this.token = token;
		}
	}

	get getToken() {
		// TO-DO
		return localStorage.getItem(this.tokenName);
	}

	setToken(value: string) {
		localStorage.setItem(this.tokenName, value);
	}

	saveLocalUserData(data: UserLocaleData) {
		const strData = JSON.stringify(data);
		localStorage.setItem(this.userDataName, strData);
	}

	getLocalUserData() {
		const data = localStorage.getItem(this.userDataName);
		if (data) {
			try {
				return JSON.parse(data) as UserLocaleData;
			} catch (e: unknown) {
				return null;
			}
		} else {
			return null;
		}
	}

	clearUserData() {
		localStorage.removeItem(this.userDataName);
		localStorage.removeItem(this.tokenName);
	}
}

export default AuthProvider;
