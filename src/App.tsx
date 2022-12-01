import './App.css';

import React from 'react';

import { autorun } from 'mobx';
import { Route, Routes, useLocation } from 'react-router-dom';

import showNotifications from './components/Notifications';
import RootStorage, { StoreProvider } from './storage';
import { ChatLayout } from './layouts/chat';

const storage = new RootStorage();

function App() {
	const location = useLocation();

	autorun(() => {
		showNotifications(storage.errorsHandler.errors);
	});

	return (
		<div className="App">
			<StoreProvider store={storage}>
				{/* <Routes location={state?.backgroundLocation || location}> */}
				<Routes location={location}>
					<Route path="/">
						<Route index element={<ChatLayout />} />
						<Route path="*" element={<div>Page 404</div>} />
					</Route>
				</Routes>
			</StoreProvider>
		</div>
	);
}

export default App;
