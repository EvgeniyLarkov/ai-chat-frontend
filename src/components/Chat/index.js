import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ChatComponent = observer(({ user, ui, chat }) => {
    const { t } = useTranslation();

    return <div></div>
})

export default ChatComponent;