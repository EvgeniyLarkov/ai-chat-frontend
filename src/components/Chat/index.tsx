import './index.css';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { ChatStates } from '../../storage/chat';
import DialogCard from './DialogCard';
import ChatWindowComponent from './ChatWindow';
import { useStore } from '../../storage';

const ChatComponent = observer(() => {
	const { chat, chatUi, user } = useStore();

	useEffect(() => {
		if (chat.allDialogsState === ChatStates.unfetched) {
			runInAction(() => {
				chat.getChatDialogs();
			});
		}
	}, [chat, chat.allDialogsState]);

	const dialogSelectHandler = (dialogUuid: string) => () => {
		if (
			chat.currentDialog !== dialogUuid &&
			chat.allDialogsState !== ChatStates.pending
		) {
			runInAction(() => {
				chat.changeCurrentDialog(dialogUuid);
				chatUi.setChatInBottom(true);
			});
		}
	};

	return (
		<div className="chat-outer">
			<div className="chat-inner">
				<div className="chat-container container">
					<div className="chat-dialogs-list">
						<div className="chat-dialogs-inner">
							{chat.dialogs.slice().map((uuid) => {
								const { messageUuid, participants, isTyping } =
									chat.getDialogData(uuid);

								if (!messageUuid) {
									return '';
								}

								const { message = null, readed = null } =
									chat.getMessageData(messageUuid);

								const opponentHash = participants.find(
									(participant) => participant !== user.hash
								);

								if (!opponentHash) {
									return '';
								}

								const opponent = chat.getChatUserData(opponentHash);

								const { firstName, lastName, photo, isOnline } = opponent;
								return (
									<div onClick={dialogSelectHandler(uuid)} key={uuid}>
										<DialogCard
											key={`${uuid}_chat`}
											message={message || ''}
											readed={readed || true}
											isOnline={isOnline || false}
											isTyping={isTyping || false}
											name={`${firstName} ${lastName}`}
											logo={photo}
										/>
									</div>
								);
							})}
						</div>
					</div>
					<div className="divider" />
					<div className="chat-messages-container">
						{chat.currentDialog && <ChatWindowComponent />}
					</div>
				</div>
			</div>
		</div>
	);
});

export default ChatComponent;
