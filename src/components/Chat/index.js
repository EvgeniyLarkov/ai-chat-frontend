import './index.css';

import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatStates } from '../../storage/chat';
import DialogCard from './DialogCard';
import ChatWindowComponent from './ChatWindow';
import { useStore } from '../../storage';

const ChatComponent = observer(() => {
    const { chat, chatUI, userStorage } = useStore();

    const { t } = useTranslation();

    useEffect(() => {
        if (chat.allDialogsState === ChatStates.unfetched) {
            action(() => chat.getChatDialogs())();
        }
    }, [chat, chat.allDialogsState])

    const dialogSelectHandler = (dialogUuid) => () => {
        if (
            chat.currentDialog !== dialogUuid
            && chat.allDialogsState !== ChatStates.pending
        ) {
            runInAction(() => {
                chat.changeCurrentDialog(dialogUuid);
                chatUI.setChatInBottom(true);
            })
        }
    }

    return (<div className="chat-outer">
        <div className="chat-inner">
            <div className="chat-dialogs-list">
                <div className="chat-dialogs-inner">
                    {chat.dialogs.slice().map((uuid) => {
                        const { messageUuid, participants, isTyping } = chat.getDialogData(uuid);
                        const {
                            message = null,
                            readed = null,
                        } = chat.getMessageData(messageUuid);

                        const opponentHash = participants.find((participant) => participant !== userStorage.hash);
                        const { firstName, lastName, logo, isOnline } = chat.getChatUserData(opponentHash);

                        console.log(isOnline)

                        return <div onClick={dialogSelectHandler(uuid)} key={uuid}>
                            <DialogCard
                                key={`${uuid}_chat`}
                                message={message}
                                readed={readed}
                                isOnline={isOnline}
                                isTyping={isTyping}
                                name={`${firstName} ${lastName}`}
                                logo={logo}
                            >
                            </DialogCard>
                        </div>
                    })}
                </div>
            </div>
            <div className="chat-messages-container">
                {
                    chat.currentDialog ?
                        <ChatWindowComponent />
                        : ''
                }
            </div>
        </div>
    </div>)
})

export default ChatComponent;