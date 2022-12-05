import React from 'react';
import { Notification } from '..';

import './index.css';

function Notification({
	item,
	visible,
}: {
	item: Notification;
	visible: boolean;
}) {
	const { message, error } = item;

	return (
		<div className={`notification ${visible && ' visible'}`}>
			<div className="notification-inner container">
				<div className="notification-label typography sublabel">{error}</div>
				<div className="divider small" />
				<div className="notification-text">{message}</div>
			</div>
		</div>
	);
}

export default Notification;
