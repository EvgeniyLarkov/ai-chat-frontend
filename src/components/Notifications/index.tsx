import { notification } from 'antd';
import { UnsuccssesRequest } from 'core/TransportLayer/types';

const showNotifications = (errors: UnsuccssesRequest[]) => {
	const lastMessage = errors[0];

	if (lastMessage) {
		notification.open({
			message: lastMessage.message,
			description: lastMessage.error,
			duration: 5,
			placement: 'topRight',
			type: 'error',
		});
	}
};

export default showNotifications;
