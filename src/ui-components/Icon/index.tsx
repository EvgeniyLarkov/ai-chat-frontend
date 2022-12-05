import React from 'react';
import './index.css';

enum IconSizes {
	medium = 'medium',
	small = 'small',
	large = 'large',
}

enum IconStyles {
	primary = 'primary',
	default = 'default',
}

type IconInterface = {
	size?: IconSizes;
	style?: IconStyles;
};

function IconComponent() {
	return <div />;
}

function Logout(props: IconInterface) {
	const { size, style } = props;

	const sizeInRem = size === IconSizes.medium ? '3rem' : '3rem';
	const iconStyle = style === IconStyles.default ? 'icon-main' : 'icon-main';

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			aria-hidden="true"
			role="img"
			width={sizeInRem}
			height={sizeInRem}
			className={iconStyle}
			viewBox="0 0 24 24"
		>
			<path
				fill="currentColor"
				d="M14.08 15.59L16.67 13H7v-2h9.67l-2.59-2.59L15.5 7l5 5l-5 5l-1.42-1.41M19 3a2 2 0 0 1 2 2v4.67l-2-2V5H5v14h14v-2.67l2-2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h14Z"
			/>
		</svg>
	);
}

export const Icon = Object.assign(IconComponent, {
	Logout,
});
