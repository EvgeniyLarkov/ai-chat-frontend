import './index.css';
import React from 'react';

type ChatMessageComponent = {
	message: string;
	isSelfMessage: boolean;
	// creationDate?: Date;
	// readed?: boolean;
};

function ChatMessageComponent({
	message,
	isSelfMessage,
}: ChatMessageComponent) {
	return (
		<div
			className={`chat-message-wrapper ${isSelfMessage ? 'self-message' : ''}`}
		>
			<div className="chat-message typography">{message}</div>
		</div>
	);
}

export default ChatMessageComponent;
