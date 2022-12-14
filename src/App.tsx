import React from 'react';
import { RoutesHandler } from 'Routes';

import RootStorage, { StoreProvider } from './storage';

const storage = new RootStorage();

function App() {
	return (
		<div className="App">
			<StoreProvider store={storage}>
				<RoutesHandler />
			</StoreProvider>
		</div>
	);
}

export default App;
