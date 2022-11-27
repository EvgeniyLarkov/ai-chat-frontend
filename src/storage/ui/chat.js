import { makeAutoObservable } from "mobx";

class ChatUIState {
    isInBottom = false;

    constructor () {
        makeAutoObservable(this);
    }

    setChatInBottom(value) {
        this.isInBottom = value;
    }
}

export default ChatUIState;