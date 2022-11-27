import './index.css';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Input } from 'antd';
import ChatMessageComponent from '../ChatMessage';
import { useStore } from '../../../storage';
import useThrottle from '../../../hooks/useThrottle';

const ChatWindowComponent = observer(() => {
    const { chat, chatUI, userStorage } = useStore();

    const [value, setValue] = useState('');
    const throttledValue = useThrottle(value, 3000);

    const [sendingMessage, setSendingMessage] = useState(false);

    const chatWindowRef = useRef(null);

    const userHash = userStorage.hash;
    const chatMessages = chat.messages;
    const chatDialog = chat.currentDialog;

    //On dialog change
    useEffect(() => {
        if (!chatWindowRef.current) {
            return;
        }
        const container = chatWindowRef.current;

        if (chatUI.isInBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }, [chatDialog, chat.dialogMessagesState, chatUI.isInBottom])

    // On new message
    useEffect(() => {
        const container = chatWindowRef.current;

        if (chatUI.isInBottom) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [chatMessages, chatMessages.length, chatUI.isInBottom])

    useEffect(() => {
        if (throttledValue === '') {
            return;
        }

        chat.userTyping(chatDialog);
    }, [throttledValue])

    const handleInput = (event) => {
        const value = event.target.value.trim();

        setValue(value);
    }

    const handleSubmit = () => {
        if (value === '' || sendingMessage) {
            return null;
        }

        setSendingMessage(true);
        chat.sendMessageToDialog(chatDialog, value)
            .finally(() => {
                setSendingMessage(false);
            });
    }

    useEffect(() => {
        if (!sendingMessage) {
            setValue('');
        }
    }, [sendingMessage])

    const handleChatScrolling = (event) => {
        const isInBottomOffset = 100;

        const container = event.target;

        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        if (scrollHeight <= clientHeight) {
            return;
        }

        const scrollTop = container.scrollTop;

        const isInBottom = (scrollHeight - clientHeight - scrollTop) < isInBottomOffset;

        chatUI.setChatInBottom(isInBottom);
    }

    return (<div className="chat-window">
        <div className="chat-window-inner">
            {chat.currentDialog !== null ?
                <div className="chat-window-messages" onScroll={handleChatScrolling} ref={chatWindowRef}>
                    {chatMessages.slice().reverse().map((msgUuid) => {
                        const data = chat.getMessageData(msgUuid);

                        return <ChatMessageComponent
                            message={data.message}
                            isSelfMessage={userHash === data.sender}
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
                        disabled={sendingMessage}
                        onInput={handleInput}
                    />
                    <Button type="primary" onClick={handleSubmit} loading={sendingMessage}>Send</Button>
                </Input.Group>
            </div>
        </div>
    </div>);
});

export default ChatWindowComponent;