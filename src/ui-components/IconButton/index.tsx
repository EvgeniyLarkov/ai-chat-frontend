/* eslint-disable react/button-has-type */
import React from 'react';
import './index.css';

type IconButtonInterface = {
	children: React.ReactNode;
	theme?: 'primary';
	fullWidth?: boolean;
	onClick?: (event: React.UIEvent<HTMLButtonElement>) => void;
};

function IconButton({
	children,
	onClick,
	theme,
	...rest
}: IconButtonInterface &
	Partial<
		React.DetailedHTMLProps<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>
	>) {
	const ButtonProps = {
		...(typeof onClick !== 'undefined' ? { onClick } : {}),
	};

	return (
		<button
			className={`icon_button${theme ? ` ${theme}` : ''}`}
			{...ButtonProps}
			{...rest}
			type={rest.type ? rest.type : 'button'}
		>
			{children}
		</button>
	);
}

export default IconButton;
