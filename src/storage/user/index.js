import {
  makeAutoObservable,
  runInAction,
} from 'mobx';

import {
  isSuccessRequest,
  isUnsuccessRequest,
} from '../../utils/requestHelper';
import AuthProvider from './auth';

export const UserLoginStates = {
    logined: 'logined',
    unlogined: 'unlogined',
    pending: 'pending',
}

class User {
    state = UserLoginStates.unlogined;
    name = null;
    email = null;
    id = null;

    constructor(transportLayer) {
        makeAutoObservable(this);
        this.transportLayer = transportLayer;
        this.AuthProvider = new AuthProvider();

        if(!!this.AuthProvider.token) {
            const userData = this.AuthProvider.getLocalUserData();

            if (userData) {
                this.setUserData(userData);
            }
        }
    }

    setUserData(user) {
        this.state = UserLoginStates.logined;

        this.id = user.id;
        this.email = user.email;
        this.name = user.firstName;
    }

    async login(data) {
        this.state = UserLoginStates.pending;
        const response = await this.transportLayer.loginUser(data);

        return runInAction(() => {
            if (isUnsuccessRequest(response)) {
                this.state = UserLoginStates.unlogined;
                return isSuccessRequest(response);
            }
    
            const { token, user } = response;

            this.setUserData(user);

            this.AuthProvider.setToken(token);
            this.AuthProvider.saveLocalUserData(user);
    
            return isSuccessRequest(response);
        })

    }

    async register(data) {
        const response = await this.transportLayer.registerUser(data);

        return isSuccessRequest(response);
    }

    unlogin() {
        this.state = UserLoginStates.unlogined;
        this.name = null;
        this.id = null;
        this.email = null;

        this.AuthProvider.clearUserData();
    }
}

export default User;