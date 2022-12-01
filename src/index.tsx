import './index.css';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
// eslint-disable-next-line import/extensions
import initLocalization from './i18n';
// import reportWebVitals from './reportWebVitals';

initLocalization();

const rootNode: HTMLElement | null = document.getElementById('root');

if (rootNode) {
	const root: ReactDOM.Root = ReactDOM.createRoot(rootNode);
	root.render(
		<React.StrictMode>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</React.StrictMode>
	);
} else {
	throw new Error('Root node is not defined');
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
