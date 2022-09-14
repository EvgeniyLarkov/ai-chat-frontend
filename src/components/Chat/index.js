import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatEntitiesStates } from '../../storage/chat';
import DialogCard from './DialogCard';

const ChatComponent = observer(({ chat }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (chat.allDialogsState === ChatEntitiesStates.unfetched) {
            action(() => chat.getChatDialogs())();
        }
    }, [chat, chat.allDialogsState])

    return (<div className="chat-outer">
        <div className="chat-inner">
            <div className="chat-dialogs-list">
                <div className="chat-dialogs-inner">
                    {chat.dialogs.slice().map((uuid) => {
                        const dialogData = chat.dialogsByHash[uuid];

                        return <DialogCard uuid={uuid} dialogData={dialogData} key={uuid}></DialogCard>
                    })}
                </div>
            </div>
            <div className="chat-messages-blog"></div>
        </div>
    </div>)
})

export default ChatComponent;