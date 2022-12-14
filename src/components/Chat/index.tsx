import './index.css';

import { Outlet, useParams } from 'react-router-dom';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { ChatStates } from '../../storage/chat';
import DialogCard from './DialogCard';
import { useStore } from '../../storage';

const ChatComponent = observer(() => {
	const { dialogUuid } = useParams();
	const data = useParams();
	const { chat, chatUi, user } = useStore();

	const dialogSelectHandler = (uuid: string | undefined) => {
		if (
			uuid &&
			chat.currentDialog !== uuid &&
			chat.allDialogsState !== ChatStates.pending
		) {
			runInAction(() => {
				chat.changeCurrentDialog(uuid);
				chatUi.setChatInBottom(true);
			});
		} else {
			chat.changeCurrentDialog(null);
		}
	};

	useEffect(() => {
		if (chat.allDialogsState === ChatStates.unfetched) {
			runInAction(() => {
				chat.getChatDialogs();
			});
		}
	}, [chat, chat.allDialogsState]);

	useEffect(() => {
		dialogSelectHandler(dialogUuid);
	}, [dialogUuid]);

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
									<DialogCard
										key={`${uuid}_chat`}
										dialogUuid={uuid}
										message={message || ''}
										readed={readed || true}
										isOnline={isOnline || false}
										isTyping={isTyping || false}
										selected={dialogUuid === uuid}
										firstname={firstName}
										lastname={lastName}
										logo={photo}
									/>
								);
							})}
						</div>
					</div>
					<div className="divider base" />
					<div className="chat-messages-container">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
});

export default ChatComponent;
