import './index.css';
import React from 'react';

type ChatMessageComponent = {
    message: string,
    isSelfMessage: boolean,
    creationDate?: Date,
    readed?: boolean,
}

const ChatMessageComponent = ({ message, isSelfMessage, creationDate, readed }: ChatMessageComponent) => {
    return (
        <div className={`chat-message-wrapper ${isSelfMessage ? 'self-message' : ''}`}>
            <div className={`chat-message`}>
                {message}
            </div>
        </div>)
}

export default ChatMessageComponent;