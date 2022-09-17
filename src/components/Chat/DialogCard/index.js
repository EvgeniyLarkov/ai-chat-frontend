import React from 'react';

import { Avatar, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';

const DialogCard = ({
  message,
  readed,
  name,
  logo,
}) => {
  return (<Card
    style={{
      width: 300,
      marginTop: 16,
    }}
  >
    <Meta
      avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
      title={name}
      description={message}
    />
  </Card>)
}

export default DialogCard;