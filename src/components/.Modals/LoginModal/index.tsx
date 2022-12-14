import React from 'react';

import { Button, Checkbox, Form, Input, Modal, Row } from 'antd';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { availableModals } from '../../../storage/ui';
import { UserLoginStates } from '../../../storage/user';

const LoginModal = observer(({ user, ui }) => {
	const { t } = useTranslation();

	const handleOk = action((values) => {
		const { username, password } = values;

		if (user.state === UserLoginStates.unlogined) {
			user
				.login({
					email: username,
					password,
				})
				.then((result) => {
					if (result) {
						ui.closeModal();
					}
				});
		} else if (user.state === UserLoginStates.logined) {
			ui.closeModal();
		}
	});

	const onRegisterClick = action(() => ui.openModal(availableModals.register));

	const handleCancel = action(() => ui.closeModal());

	return (
		<Modal
			title={t('login.label')}
			visible={ui.currentModal === availableModals.login}
			confirmLoading={user.state === UserLoginStates.pending}
			onCancel={handleCancel}
			footer={null}
		>
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{
					remember: true,
				}}
				onFinish={handleOk}
			>
				<Form.Item
					name="username"
					rules={[
						{
							required: true,
							message: t('login.errors.email-empty'),
						},
					]}
				>
					<Input
						prefix={<UserOutlined className="site-form-item-icon" />}
						placeholder={t('login.email')}
					/>
				</Form.Item>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: t('login.errors.password-empty'),
						},
					]}
				>
					<Input
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder={t('login.password')}
					/>
				</Form.Item>
				<Form.Item>
					<Row justify="space-between">
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>{t('login.stay-logined')}</Checkbox>
						</Form.Item>

						<a className="login-form-forgot" href="">
							{t('login.forgot')}
						</a>
					</Row>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						className="login-form-button"
						block
					>
						{t('login.login')}
					</Button>
					<div>
						Or{' '}
						<Button onClick={onRegisterClick} type="link">
							{t('login.register')}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
});

export default LoginModal;
