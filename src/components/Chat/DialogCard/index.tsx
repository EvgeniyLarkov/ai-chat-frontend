import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'ui-components/Icon';

import './index.css';

type DialogCardInterface = {
	message: string;
	dialogUuid: string;
	readed: boolean;
	firstname: string;
	lastname: string;
	logo?: string;
	selected?: boolean;
	isOnline: boolean;
	isTyping: boolean;
};

function DialogCard({
	dialogUuid,
	message,
	readed,
	firstname,
	lastname,
	logo = '',
	selected = false,
	isOnline,
	isTyping,
}: DialogCardInterface) {
	const [hasLogo, setHasLogo] = useState(logo.length > 0);

	const handleLogoError = () => {
		setHasLogo(false);
	};

	const cardStyles = [
		...(isTyping ? ['typing'] : []),
		...(isOnline ? ['online'] : []),
		...(selected ? ['selected'] : []),
	].join(' ');

	const nameHint = `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`;

	return (
		<div className={`dialog-card ${cardStyles}`}>
			<div className="dialog-card_inner">
				<Link className="dialog-card_avatar_wrapper" to={dialogUuid}>
					<div className="dialog-card_avatar">
						{!hasLogo && (
							<div className="dialog-card_avatar-hint typography">
								{nameHint}
							</div>
						)}
						<div className="dialog-card_avatar-overlay">
							<Icon.Typing />
						</div>
						{hasLogo && (
							<img
								src={logo}
								onError={handleLogoError}
								className="dialog-card_avatar-image"
								alt={`${firstname} ${lastname} logo`}
							/>
						)}
					</div>
					<div className="dialog-card_avatar_circle-1" />
				</Link>
				<div className="dialog-card_username typography">{firstname}</div>
			</div>
		</div>
	);
}

export default DialogCard;
