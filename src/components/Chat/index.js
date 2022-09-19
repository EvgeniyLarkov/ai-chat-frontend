import './index.css';

import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatStates } from '../../storage/chat';
import DialogCard from './DialogCard';
import ChatWindowComponent from './ChatWindow';

const ChatComponent = observer(({ chat, user }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (chat.allDialogsState === ChatStates.unfetched) {
            action(() => chat.getChatDialogs())();
        }
    }, [chat.allDialogsState])

    const dialogSelectHandler = (dialogUuid) => () => {
        if (
            chat.currentDialog !== dialogUuid
            && chat.allDialogsState !== ChatStates.pending
        ) {
            action(() => chat.changeCurrentDialog(dialogUuid))();
        }

    }

    return (<div className="chat-outer">
        <div className="chat-inner">
            <div className="chat-dialogs-list">
                <div className="chat-dialogs-inner">
                    {chat.dialogs.slice().map((uuid) => {
                        const { messageUuid, name, participants } = chat.getDialogData(uuid);
                        const {
                            message = null,
                            readed = null,
                            senderUuid = null
                        } = chat.getMessageData(messageUuid);

                        const opponentHash = participants.find((participant) => participant !== user.hash);
                        const { firstName, lastName, logo } = chat.getChatUserData(opponentHash);

                        return <div onClick={dialogSelectHandler(uuid)} key={uuid}>
                            <DialogCard
                                message={message}
                                readed={readed}
                                name={`${firstName} ${lastName}`}
                                logo={logo}
                            >
                            </DialogCard>
                        </div>
                    })}
                </div>
            </div>
            <div className="chat-messages-container">
                <ChatWindowComponent chat={chat} user={user}></ChatWindowComponent>
            </div>
        </div>
    </div>)
})

export default ChatComponent;