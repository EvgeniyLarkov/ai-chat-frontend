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
import { useTranslation } from 'react-i18next';

import { availableModals } from '../../../storage/ui';
import { UserLoginStates } from '../../../storage/user';

const RegisterModal = observer(({ user, ui }) => {
    const { t } = useTranslation();

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
                    label={t('register.email')}
                    rules={[
                        {
                            type: 'email',
                            message: t('register.errors.email-invalid'),
                        },
                        {
                            required: true,
                            message: t('register.errors.email-empty'),
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={t('register.password')}
                    rules={[
                        {
                            required: true,
                            message: t('register.errors.password-empty'),
                        },
                        {
                            min: 6,
                            message: t('register.errors.password-short'),
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label={t('register.confirm-password')}
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: t('register.errors.password-not-confirmed'),
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }

                                return Promise.reject(new Error(t('register.errors.password-not-match')));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="firstName"
                    label={t('register.firstName')}
                    tooltip={t('register.firstName-tooltip')}
                    rules={[
                        {
                            required: true,
                            message: t('register.errors.firstName-empty'),
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="secondName"
                    label={t('register.secondName')}
                    tooltip={t('register.secondName-tooltip')}
                    rules={[
                        {
                            required: true,
                            message: t('register.errors.secondName-empty'),
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block={true} loading={registerPending}>
                        {t('register.submit')}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
})


export default RegisterModal;