import './App.css';

import React from 'react';

import { autorun } from 'mobx';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import showNotifications from './components/Notifications';
import ModalHandler from './core/ModalHandler';
import RootStorage, { StoreProvider } from './storage';
import { ChatLayout } from './layouts/chat';

const storage = new RootStorage();

function App() {
  const location = useLocation();
  const state = location.state;

  autorun(() => {
    showNotifications(storage.errorsHandler.errors)
  })

  return (
    <div className="App">
      <StoreProvider store={storage}>
        <Routes location={state?.backgroundLocation || location}>

          <Route path="/">
            <Route index element={<ChatLayout storage={storage}></ChatLayout>} />
            <Route path="*" element={<div>Page 404</div>} />
          </Route>
        </Routes>

        <ModalHandler storage={storage}></ModalHandler>
      </StoreProvider>
    </div>
  );
}

export default App;
