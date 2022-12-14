import React, { ChangeEvent } from 'react';
import './index.css';

export type InputInterface = {
	value?: string | number;
	disabled?: boolean;
	fullWidth?: boolean;
	onClick?: (event: React.UIEvent<HTMLInputElement>) => void;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	onInput?: (event: React.UIEvent<HTMLInputElement>) => void;
} & React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

function Input({
	value,
	fullWidth = false,
	disabled = false,
	onClick,
	onChange,
	onInput,
	...rest
}: InputInterface) {
	const InputProps = {
		...(typeof onClick !== 'undefined' ? { onClick } : {}),
		...(typeof onChange !== 'undefined' ? { onChange } : {}),
		...(typeof onInput !== 'undefined' ? { onInput } : {}),
	};

	return (
		<input
			className={`input${fullWidth ? ' full-width' : ''}`}
			value={typeof value !== 'undefined' ? value : ''}
			disabled={disabled}
			{...InputProps}
			{...rest}
		/>
	);
}

export default Input;
