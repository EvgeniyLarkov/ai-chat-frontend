import React from 'react';

import { Route, Routes, useLocation } from 'react-router-dom';

import BaseLayout from 'layouts/base';
import ChatComponent from 'components/Chat';
import RootStorage, { StoreProvider } from './storage';

const storage = new RootStorage();

function App() {
	const location = useLocation();

	return (
		<div className="App">
			<StoreProvider store={storage}>
				<Routes location={location}>
					<Route path="/" element={<BaseLayout />}>
						<Route index element={<ChatComponent />} />
						<Route path="*" element={<div>Page 404</div>} />
					</Route>
				</Routes>
			</StoreProvider>
		</div>
	);
}

export default App;
