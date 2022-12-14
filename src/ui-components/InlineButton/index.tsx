/* eslint-disable react/button-has-type */
import React from 'react';
import './index.css';

type InlineButtonInterface = {
	children: React.ReactNode;
	theme?: 'primary';
	onClick?: (event: React.UIEvent<HTMLButtonElement>) => void;
};

function InlineButton({
	children,
	onClick,
	theme,
	...rest
}: InlineButtonInterface &
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
			className={`inline_button${theme ? ` ${theme}` : ''}`}
			{...ButtonProps}
			{...rest}
			type={rest.type ? rest.type : 'button'}
		>
			{children}
		</button>
	);
}

export default InlineButton;
