import React, { createContext, type ReactNode } from 'react';
import AuthProvider from '../core/AuthProvider';
import TransportLayer from '../core/TransportLayer';
import Chat from './chat';
import ErrorStore from './error';
import Reactions from './reactions';
import UI from './ui';
import ChatUiState from './ui/chat';
import User from './user';

class RootStorage {
	errorsHandler: ErrorStore;

	authProvider: AuthProvider;

	transportLayer: TransportLayer;

	chat: Chat;

	userStorage: User;

	UiStorage: UI;

	chatUi: ChatUiState;

	reactionsHandler: Reactions;

	constructor() {
		this.errorsHandler = new ErrorStore();
		this.authProvider = new AuthProvider();
		this.transportLayer = new TransportLayer(
			this.errorsHandler,
			this.authProvider
		);

		this.chat = new Chat(this.transportLayer);
		this.userStorage = new User(this.transportLayer, this.authProvider);
		this.UiStorage = new UI();
		this.chatUi = new ChatUiState();

		this.reactionsHandler = new Reactions(this.chat);

		this.transportLayer.applyReactionsHandler(this.reactionsHandler);
	}
}

const StoreContext = createContext<null | RootStorage>(null);

export function StoreProvider({
	children,
	store,
}: {
	children: ReactNode;
	store: RootStorage;
}) {
	return (
		<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
	);
}

export const useStore = () =>
	React.useContext<RootStorage>(StoreContext as React.Context<RootStorage>);

export default RootStorage;
