import './App.css';

import React from 'react';

import { Layout } from 'antd';
import { autorun } from 'mobx';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import HeaderComponent from './components/Header';
import showNotifications from './components/Notifications';
import ModalHandler from './core/ModalHandler';
import RootStorage from './storage';

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
          <Route index element={<Layout><HeaderComponent user={storage.userStorage} ui={storage.UIStorage} /></Layout>} />
          <Route path="*" element={<div>Page 404</div>} />
        </Route>
      </Routes>

      <ModalHandler storage={storage}></ModalHandler>
    </div>
  );
}

export default App;
