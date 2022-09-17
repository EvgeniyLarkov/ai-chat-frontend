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
import RootStorage from './storage';
import { ChatLayout } from './layouts/chat';

function App() {
  const location = useLocation();
  const state = location.state;
  const storage = new RootStorage();

  autorun(() => {
    showNotifications(storage.errorsHandler.errors)
  })

  return (
    <div className="App">
      <Routes location={state?.backgroundLocation || location}>

        <Route path="/">
          <Route index element={<ChatLayout storage={storage}></ChatLayout>} />
          <Route path="*" element={<div>Page 404</div>} />
        </Route>
      </Routes>

      <ModalHandler storage={storage}></ModalHandler>
    </div>
  );
}

export default App;
