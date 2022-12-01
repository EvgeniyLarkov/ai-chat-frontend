import React, {useState, useEffect, useRef} from 'react';

import {Avatar, Badge, Card} from 'antd';
import Meta from 'antd/lib/card/Meta';

type DialogCardInterface = {
	message: string;
	readed: boolean;
	name: string;
	logo?: string;
	selected?: boolean;
	isOnline: boolean;
	isTyping: boolean;
};

const DialogCard = ({
	message,
	readed,
	name,
	logo = '',
	selected = false,
	isOnline,
	isTyping,
}: DialogCardInterface) => {
	const typingTimerRef = useRef<{ dots: number, timerId: null | NodeJS.Timer}>({dots: 0, timerId: null});
	const [currentMessage, setCurrentMessage] = useState(message);

	const UserAvatar = <Avatar>{name}</Avatar>;

	useEffect(() => {
		const timerId = typingTimerRef.current.timerId;

		if (!isTyping && timerId) {
			clearInterval(timerId);
			setCurrentMessage(message);
			return;
		}

		typingTimerRef.current.timerId = setInterval(() => {
			let {dots} = typingTimerRef.current;

			if (dots > 3) {
				dots = 0;
			} else {
				dots += 1;
			}

			const messageText = 'User typing' + '.'.repeat(dots);
			typingTimerRef.current.dots = dots;

			setCurrentMessage(messageText);
		}, 750);
	}, [message, isTyping]);

	return (<Card
		style={{
			width: 250,
		}}
	>
		<Meta
			avatar={<Badge dot={true} status={ isOnline ? 'success' : 'error'}>
				{UserAvatar}
			</Badge>}
			title={name}
			description={currentMessage}
		/>
	</Card>);
};

export default DialogCard;
