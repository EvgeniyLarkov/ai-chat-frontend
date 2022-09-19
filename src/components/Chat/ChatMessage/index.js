import './index.css';
import React from 'react';
import { Typography } from 'antd';

const ChatMessageComponent = ({ message, isSelfMessage, creationDate, readed }) => {
    return (
        <div className='chat-message-wrapper'>
            <div className={`chat-message ${isSelfMessage ?? 'self-message'}`}>
                <Typography>{message}</Typography>
            </div>
        </div>)
}

export default ChatMessageComponent;