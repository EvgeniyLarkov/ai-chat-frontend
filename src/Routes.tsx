import React from 'react';

import { Route, Routes, useLocation } from 'react-router-dom';

import BaseLayout from 'layouts/base';
import ChatComponent from 'components/Chat';
import ChatWindowComponent from 'components/Chat/ChatWindow';
import { useStore } from 'storage';
import { observer } from 'mobx-react-lite';
import { UserLoginStates } from 'storage/user';
import ProfileBox from 'components/Profile';

export enum Paths {
	chat = 'chat',
	profile = 'profile',
}

export const RoutesHandler = observer(() => {
	const location = useLocation();
	const { user } = useStore();

	return (
		<Routes location={location}>
			<Route path="/" element={<BaseLayout />}>
				{user.state === UserLoginStates.logined && (
					<>
						<Route path={Paths.chat} element={<ChatComponent />}>
							<Route path=":dialogUuid" element={<ChatWindowComponent />} />
						</Route>
						<Route path={Paths.profile} element={<ProfileBox />} />
					</>
				)}
				<Route path="*" element={<div>Page 404</div>} />
			</Route>
		</Routes>
	);
});
