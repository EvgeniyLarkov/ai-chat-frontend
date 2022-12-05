import { UnsuccssesRequest } from 'core/TransportLayer/types';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStore } from 'storage';

import './index.css';
import Notification from './Notification';

export type Notification = UnsuccssesRequest;

const NotificationEngine = observer(() => {
	const { errorsHandler } = useStore();
	const { errors } = errorsHandler;

	const [thisMessages, setThisMessages] = useState<Notification[]>(errors);
	const [visibleMessages, setVisibleMessages] = useState<
		Record<number, boolean>
	>({});

	useEffect(() => {
		const showTime = 5000;
		const lengthDiff = errors.length - thisMessages.length;

		if (lengthDiff > 0) {
			const newMessages = errors.slice(-lengthDiff);
			const resultMessages = [...thisMessages, ...newMessages];

			setThisMessages(resultMessages);

			const visibleIndexes: Record<number, boolean> = {};

			for (
				let i = resultMessages.length - lengthDiff;
				i <= resultMessages.length;
				i += 1
			) {
				visibleIndexes[i - 1] = true;
			}

			setVisibleMessages({ ...visibleMessages, ...visibleIndexes });

			setTimeout(() => {
				const invisibleIndexes = Object.keys(visibleIndexes).reduce(
					(acc, index) => {
						return { ...acc, [index]: false };
					},
					{}
				);

				setVisibleMessages({ ...visibleMessages, ...invisibleIndexes });
			}, showTime);
		}
	}, [errors, errors.length, thisMessages]);

	const handleNotificationsShow = () => {
		const result = Object.keys(visibleMessages).reduce((acc, index) => {
			return { ...acc, [index]: true };
		}, {});

		setVisibleMessages(result);
	};

	const handleNotificationsHide = () => {
		const result = Object.keys(visibleMessages).reduce((acc, index) => {
			return { ...acc, [index]: false };
		}, {});

		setVisibleMessages(result);
	};

	return (
		<div
			className="notifications-box"
			onMouseEnter={handleNotificationsShow}
			onMouseLeave={handleNotificationsHide}
		>
			<div className="notifications-box_inner">
				{thisMessages
					.map((message, index) => {
						return (
							<Notification
								visible={visibleMessages[index]}
								key={`${message.message}_${index + 1}`}
								item={message}
							/>
						);
					})
					.reverse()}
			</div>
		</div>
	);
});

export default NotificationEngine;
