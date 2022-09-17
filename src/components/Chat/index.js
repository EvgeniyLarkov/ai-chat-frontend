import './index.css';

import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatStates } from '../../storage/chat';
import DialogCard from './DialogCard';

const ChatComponent = observer(({ chat, user }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (chat.allDialogsState === ChatStates.unfetched) {
            action(() => chat.getChatDialogs())();
        }
    }, [chat, chat.allDialogsState])

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

                        return <DialogCard
                            message={message}
                            readed={readed}
                            name={`${firstName} ${lastName}`}
                            logo={logo}
                            key={uuid}>
                        </DialogCard>
                    })}
                </div>
            </div>
            <div className="chat-messages-container"></div>
        </div>
    </div>)
})

export default ChatComponent;