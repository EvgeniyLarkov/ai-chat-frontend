import { notification } from 'antd';

const showNotifications = (errors) => {
    console.log(errors.length)

    const lastMessage = errors[0];

    if (lastMessage) {
        notification.open({
            message: lastMessage.name,
            description: lastMessage.description,
            duration: 5,
            placement: 'topRight',
            type: "error"
        })
    }
};

export default showNotifications;