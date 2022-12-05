import './index.css';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Input } from 'antd';
import ChatMessageComponent from '../ChatMessage';
import { useStore } from '../../../storage';
import useThrottle from '../../../hooks/useThrottle';

const ChatWindowComponent = observer(() => {
	const { chat, chatUi, user } = useStore();

	const [value, setValue] = useState('');

	const inputThrottleTimeout = 3000;
	const throttledValue = useThrottle(value, inputThrottleTimeout);

	const [sendingMessage, setSendingMessage] = useState(false);

	const chatWindowRef = useRef<HTMLDivElement>(null);

	const userHash = user.hash;
	const chatMessages = chat.messages;
	const chatDialog = chat.currentDialog as string;

	// On dialog change
	useEffect(() => {
		if (!chatWindowRef.current) {
			return;
		}

		const container = chatWindowRef.current;

		if (chatUi.isInBottom) {
			container.scrollTop = container.scrollHeight;
		}
	}, [chatDialog, chat.dialogMessagesState, chatUi.isInBottom]);

	// On new message
	useEffect(() => {
		const container = chatWindowRef.current;

		if (chatUi.isInBottom && container) {
			container.scrollTo({
				top: container.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [chatMessages, chatMessages.length, chatUi.isInBottom]);

	useEffect(() => {
		if (throttledValue === '') {
			return;
		}

		chat.userTyping(chatDialog);
	}, [throttledValue]);

	const handleInput = (event: React.UIEvent<HTMLInputElement>) => {
		const inputValue = event.currentTarget.value.trim();

		setValue(inputValue);
	};

	const handleSubmit = (): void => {
		if (value === '' || sendingMessage) {
			return;
		}

		setSendingMessage(true);
		chat.sendMessageToDialog(chatDialog, value).finally(() => {
			setSendingMessage(false);
		});
	};

	useEffect(() => {
		if (!sendingMessage) {
			setValue('');
		}
	}, [sendingMessage]);

	const handleChatScrolling = (event: React.UIEvent<HTMLElement>) => {
		const isInBottomOffset = 100;

		const container = event.currentTarget;

		const { scrollHeight } = container;
		const { clientHeight } = container;

		if (scrollHeight <= clientHeight) {
			return;
		}

		const { scrollTop } = container;

		const isInBottom =
			scrollHeight - clientHeight - scrollTop < isInBottomOffset;

		chatUi.setChatInBottom(isInBottom);
	};

	return (
		<div className="chat-window">
			<div className="chat-window-inner">
				{chat.currentDialog !== null ? (
					<div
						className="chat-window-messages"
						onScroll={handleChatScrolling}
						ref={chatWindowRef}
					>
						{chatMessages
							.slice()
							.reverse()
							.map((msgUuid) => {
								const data = chat.getMessageData(msgUuid);

								return (
									<ChatMessageComponent
										message={data.message}
										isSelfMessage={userHash === data.sender}
										key={msgUuid}
									/>
								);
							})}
					</div>
				) : (
					''
				)}
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
						<Button
							type="primary"
							onClick={handleSubmit}
							loading={sendingMessage}
						>
							Send
						</Button>
					</Input.Group>
				</div>
			</div>
		</div>
	);
});

export default ChatWindowComponent;
