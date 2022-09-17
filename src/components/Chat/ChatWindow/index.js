import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Input } from 'antd';

const ChatWindowComponent = observer(({ chat, user }) => {
    const [value, setValue] = useState('');

    const userHash = user.hash;
    const chatMessages = chat.get

    return (<div class="chat-window">
        <div class="chat-window-inner">
            (chat.currentDialog)
            <div class="chat-window-messages"></div>
            <div class="chat-window-actions">
                <Input.Group compact>
                    <Input
                        style={{
                            width: 'calc(100% - 200px)',
                        }}
                        value={value}
                        onInput={((val) => { setValue(val) })}
                    />
                    <Button type="primary">Send</Button>
                </Input.Group>
            </div>
        </div>
    </div>);
});

export default ChatWindowComponent;