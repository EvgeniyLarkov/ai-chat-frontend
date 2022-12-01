import i18next from 'i18next';
import { makeAutoObservable, runInAction } from 'mobx';

export const availableModals = {
	login: 'login',
	register: 'register',
	registerConfirmation: 'registerConfirm',
};

class UI {
	currentModal = null;

	lang = '';

	constructor() {
		makeAutoObservable(this);
		this.lang = localStorage.getItem('i18nextLng') || 'en';
	}

	changeLanguage(lang: string) {
		i18next.changeLanguage(lang).then(() => {
			runInAction(() => {
				this.lang = lang;
			});
		});
	}
}

export default UI;
