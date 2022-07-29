import {
  computed,
  makeAutoObservable,
} from 'mobx';

class AuthProvider {
    token = null;
    tokenName = "jwt_auth_token";
    userDataName = "user_data";

    constructor () {
        makeAutoObservable(this, {
            getToken: computed
        });
        const token = localStorage.getItem(this.tokenName);

        if (token) {
            this.token = token;
        }
    }

    get getToken() {
        return localStorage.getItem(this.tokenName);
    }

    setToken(value) {
        localStorage.setItem(this.tokenName, value);
    }

    saveLocalUserData(data) {
        const strData = JSON.stringify(data);
        localStorage.setItem(this.userDataName, strData);
    }

    getLocalUserData() {
        const data = localStorage.getItem(this.userDataName);
        try {
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }

    clearUserData() {
        localStorage.removeItem(this.userDataName);
        localStorage.removeItem(this.tokenName);
    }
}

export default AuthProvider;