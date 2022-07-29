import React, { useState } from 'react';

import {
  Button,
  Form,
  Input,
  Modal,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import {
  action,
  runInAction,
} from 'mobx';
import { observer } from 'mobx-react-lite';

import { availableModals } from '../../../storage/ui';
import { UserLoginStates } from '../../../storage/user';

const RegisterModal = observer(({ user, ui }) => {
    const [registerPending, setRegisterPending] = useState(false);
    const [form] = useForm();

    const onFinish = action((formData) => {
        const {email, password, firstName, secondName} = formData;

        if (user.state === UserLoginStates.unlogined) {
            setRegisterPending(true);
            user.register({
                email,
                password,
                firstName,
                lastName: secondName
            }).then((result) => {
                setRegisterPending(false);

                if (result) {
                    runInAction(ui.openModal(availableModals.registerConfirmation));
                }
            });
        } else if (user.state === UserLoginStates.logined) {
            ui.closeModal();
        }
    })

    return (
        <Modal title="Регистрация"
            visible={ui.currentModal === availableModals.register}
            footer={null}
            onCancel={() => ui.closeModal()}
        >
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                layout="vertical"
                scrollToFirstError
            >
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        {
                            min: 6,
                            message: 'Minimal length is 6 symbols',
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="firstName"
                    label="firstName"
                    tooltip="Your first name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="secondName"
                    label="secondName"
                    tooltip="Your second name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your second name!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block={true} loading={registerPending}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
})


export default RegisterModal;