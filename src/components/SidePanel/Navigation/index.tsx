import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Paths } from 'Routes';

import './index.css';

export function SideNavigation() {
	const { t } = useTranslation();

	const getClasses = ({ isActive }: { isActive: boolean }) =>
		`button sidepanel_navigation-item${isActive ? ' selected' : ''}`;

	return (
		<div className="sidepanel_navigation">
			<div className="sidepanel_navigation_inner">
				<NavLink to={Paths.chat} className={getClasses}>
					{t('navigation.chat')}
				</NavLink>
				<NavLink to={Paths.profile} className={getClasses}>
					{t('navigation.profile')}
				</NavLink>
			</div>
		</div>
	);
}
