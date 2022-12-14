import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useStore } from 'storage';
import { UserLoginStates } from 'storage/user';
import Button from 'ui-components/Button';
import './index.css';
import IconButton from 'ui-components/IconButton';
import { Icon } from 'ui-components/Icon';

import { observer } from 'mobx-react-lite';
import { UserLoginData } from 'storage/user/types';
import LoginBox from './Login';
import { SideNavigation } from './Navigation';
import RegisterBox from './Register';

enum SidePanelForms {
	'register' = 'register',
	'login' = 'login',
}

const SidePanel = observer(() => {
	const { user } = useStore();
	const { t } = useTranslation();

	const [form, setForm] = useState<SidePanelForms | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const formParam = searchParams.get('form');

		if (
			formParam &&
			form !== formParam &&
			typeof SidePanelForms[formParam] === 'string'
		) {
			setForm(formParam as SidePanelForms);
		} else if (formParam === null) {
			setForm(null);
		}
	}, [form, searchParams]);

	const handleOpenLogin = () => {
		setSearchParams({ form: SidePanelForms.login });
	};

	const handleOpenRegister = () => {
		setSearchParams({ form: SidePanelForms.register });
	};

	const handleOpenDefault = () => {
		searchParams.delete('form');
		setSearchParams(searchParams);
	};

	const handleSuccessRegister = (data: UserLoginData) => {
		handleOpenDefault();
		user.login(data);
	};

	const handleLogout = () => {
		user.logout();
	};

	return (
		<div className="sidepanel">
			<div className="sidepanel_inner container">
				{form === null && (
					<div className="sidepanel_header">
						{user.state === UserLoginStates.unlogined && (
							<div className="sidepanel_header-unlogined">
								<Button fullWidth onClick={handleOpenLogin}>
									{t('header.login')}
								</Button>
							</div>
						)}
						{user.state === UserLoginStates.logined && (
							<div className="sidepanel_header-logined">
								<div className="sidepanel_header-greeting">
									<div className="sidepanel_header-greeting-text">
										{t('header.greeting')}
									</div>
									<div className="sidepanel_header-greeting-name">
										{user.name}
									</div>
								</div>
								<IconButton onClick={handleLogout}>
									<Icon.Logout />
								</IconButton>
							</div>
						)}
						<div className="divider" />
						<SideNavigation />
					</div>
				)}
				{form === SidePanelForms.login && (
					<>
						<div className="sidepanel_header">
							<Button fullWidth onClick={handleOpenDefault}>
								{t('header.back')}
							</Button>
							<div className="divider" />
						</div>
						<LoginBox successCallback={handleOpenDefault} />
						<div className="divider base" />
						<Button fullWidth onClick={handleOpenRegister}>
							{t('header.register')}
						</Button>
					</>
				)}
				{form === SidePanelForms.register && (
					<>
						<div className="sidepanel_header">
							<Button fullWidth onClick={handleOpenDefault}>
								{t('header.back')}
							</Button>
							<div className="divider" />
						</div>
						<RegisterBox successCallback={handleSuccessRegister} />
					</>
				)}
			</div>
		</div>
	);
});

export default SidePanel;
