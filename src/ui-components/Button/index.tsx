/* eslint-disable react/button-has-type */
import React from 'react';
import './index.css';

type ButtonInterface = {
	children: React.ReactNode;
	theme?: 'primary';
	fullWidth?: boolean;
	onClick?: (event: React.UIEvent<HTMLButtonElement>) => void;
};

function Button({
	children,
	onClick,
	theme,
	fullWidth = false,
	...rest
}: ButtonInterface &
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
			className={`button${theme ? ` ${theme}` : ''}${
				fullWidth ? ` full-width` : ''
			}`}
			{...ButtonProps}
			{...rest}
			type={rest.type ? rest.type : 'button'}
		>
			{children}
		</button>
	);
}

export default Button;
