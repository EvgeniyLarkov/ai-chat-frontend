import React from 'react';

import { observer } from 'mobx-react-lite';

import LoginModal from '../../components/.Modals/LoginModal';
import RegisterConfirmationModal
  from '../../components/.Modals/RegisterConfirmationModal';
import RegisterModal from '../../components/.Modals/RegisterModal';
import { availableModals } from '../../storage/ui';

const ModalHandler =  observer(({ storage }) => {
    const ui = storage.UiStorage;

    return (
        <>
            {ui.currentModal === availableModals.login ? <LoginModal user={storage.userStorage} ui={ui} /> : ''}
            {ui.currentModal === availableModals.register ? <RegisterModal user={storage.userStorage} ui={ui} />  : ''}
            {ui.currentModal === availableModals.registerConfirmation ? <RegisterConfirmationModal ui={ui} />  : ''}
        </>
    );
})

export default ModalHandler;