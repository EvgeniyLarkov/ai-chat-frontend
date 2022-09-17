import {
  makeAutoObservable,
  runInAction,
} from 'mobx';

import {
  isSuccessRequest,
  isUnsuccessRequest,
} from '../../utils/requestHelper';

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
    hash = null;

    constructor(transportLayer, authProvider) {
        makeAutoObservable(this);
        this.authProvider = authProvider;
        this.transportLayer = transportLayer;

        if(!!this.authProvider.token) {
            const userData = this.authProvider.getLocalUserData();

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
        this.hash = user.hash;
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

            this.authProvider.setToken(token);
            this.authProvider.saveLocalUserData(user);
    
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

        this.authProvider.clearUserData();
    }
}

export default User;