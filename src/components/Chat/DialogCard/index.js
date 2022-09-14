import React from 'react';

import { Avatar, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';

const DialogCard = ({ uuid, dialogData }) => {
    const { name, logo } = dialogData;

    return (<Card
        style={{
          width: 300,
          marginTop: 16,
        }}

        key={uuid}
      >
        <Meta
          avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title={name}
          description="Message should be here"
        />
      </Card>)
}

export default DialogCard;