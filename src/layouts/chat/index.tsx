import React from 'react';

import { Layout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { observer } from 'mobx-react-lite';
import ChatComponent from '../../components/Chat';

export const ChatLayout = observer(() => {
	return (
		<Layout style={{ height: '100vh' }}>
			<Content>
				<ChatComponent />
			</Content>
		</Layout>
	);
});
