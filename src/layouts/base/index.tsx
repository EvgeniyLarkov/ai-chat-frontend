import './index.css';

import SidePanel from 'components/SidePanel';
import React from 'react';
import { Outlet } from 'react-router-dom';
import NotificationEngine from 'components/Notifications';

function BaseLayout() {
	return (
		<div className="base-layout">
			<div className="base-layout-inner">
				<aside className="base-layout-sidepanel">
					<SidePanel />
				</aside>
				<div className="base-layout-content">
					<Outlet />
				</div>
				<NotificationEngine />
			</div>
		</div>
	);
}

export default BaseLayout;
