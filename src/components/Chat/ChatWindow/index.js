import './index.css';

import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Input } from 'antd';
import ChatMessageComponent from '../ChatMessage';

const ChatWindowComponent = observer(({ chat, user }) => {
    const [value, setValue] = useState('');

    const userHash = user.hash;
    const chatMessages = chat.messages;

    return (<div className="chat-window">
        <div className="chat-window-inner">
            {chat.currentDialog !== null ?
                <div className="chat-window-messages">
                    {chatMessages.slice().reverse().map((msgUuid) => {
                        const data = chat.getMessageData(msgUuid);

                        return <ChatMessageComponent
                            message={data.message}
                            isSelfMessage={userHash !== data.sender}
                            key={msgUuid}
                        ></ChatMessageComponent>;
                    })}
                </div> : ''}
            <div className="chat-window-actions">
                <Input.Group compact>
                    <Input
                        style={{
                            width: 'calc(100% - 200px)',
                        }}
                        value={value}
                        onInput={((val) => { setValue(val) })}
                    />
                    <Button type="primary">Send</Button>
                </Input.Group>
            </div>
        </div>
    </div>);
});

export default ChatWindowComponent;