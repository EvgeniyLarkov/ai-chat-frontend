import { makeAutoObservable } from 'mobx';

class ChatUiState {
	isInBottom = false;

	constructor() {
		makeAutoObservable(this);
	}

	setChatInBottom(value: boolean) {
		this.isInBottom = value;
	}
}

export default ChatUiState;
