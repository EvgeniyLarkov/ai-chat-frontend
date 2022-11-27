import React from 'react';

import { Layout } from "antd"
import { Content } from "antd/lib/layout/layout"
import { observer } from "mobx-react-lite";
import ChatComponent from "../../components/Chat"
import HeaderComponent from "../../components/Header"

export const ChatLayout = observer(({ storage }) => {
    return (<Layout style={{ height: "100vh" }}>
        <HeaderComponent user={storage.userStorage} ui={storage.UIStorage} />
        <Content>
            <ChatComponent />
        </Content>
    </Layout>)
});