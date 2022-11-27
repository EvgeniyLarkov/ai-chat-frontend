import './index.css';
import React from 'react';

const ChatMessageComponent = ({ message, isSelfMessage, creationDate, readed }) => {
    return (
        <div className={`chat-message-wrapper ${isSelfMessage ? 'self-message' : ''}`}>
            <div className={`chat-message`}>
                {message}
            </div>
        </div>)
}

export default ChatMessageComponent;