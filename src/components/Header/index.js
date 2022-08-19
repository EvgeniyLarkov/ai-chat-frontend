import './index.css';

import React from 'react';

import {
  Button,
  Col,
  Dropdown,
  Menu,
  Row,
  Space,
  Typography,
} from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import Icon, {
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { availableModals } from '../../storage/ui';
import { UserLoginStates } from '../../storage/user';

const HeaderComponent = observer(({ user, ui }) => {
    const { t } = useTranslation();

    const handleLoginClick = action(() => ui.openModal(availableModals.login))
    const handleLogoutClick = action(() => user.unlogin());

    return (
        <Header>
            <Row>
                <Col span={18}><Row justify='start' align='stretch'><Typography.Title level={3}
                    style={{
                        margin: 0,
                        marginTop: '0.5em',
                        color: `#e2e1e1`,
                    }}
                >Online chat with AI</Typography.Title></Row>
                </Col>
                <Col span={6}>
                    <Space>
                        {user.state === UserLoginStates.logined ? <>
                            <Typography.Text className='header-text'>{t('header.greeting', { username: user.name })}</Typography.Text>
                            <Button
                                type='secondary'
                                shape="round"
                                size="large"
                                icon={<LogoutOutlined />}
                                loading={user.state === UserLoginStates.pending}
                                onClick={handleLogoutClick}
                            ></Button>
                        </>
                            : <>
                            <Button
                            type={'primary'}
                            shape="round"
                            size="large"
                            icon={<LoginOutlined />}
                            loading={user.state === UserLoginStates.pending}
                            onClick={handleLoginClick}
                        >{t('header.login')}</Button>
                            </>}

                        <ChangeLanguageEL ui={ui} />
                    </Space>
                </Col>
            </Row>
        </Header>)
});

const RuFlag = () => (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" id="flag-icons-ru" viewBox="0 0 512 512">
    <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#fff" d="M0 0h512v512H0z" />
        <path fill="#0039a6" d="M0 170.7h512V512H0z" />
        <path fill="#d52b1e" d="M0 341.3h512V512H0z" />
    </g>
</svg>)

const IconRU = () => (<Icon component={RuFlag} size={32} />)

const EnFlag = () => (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" id="flag-icons-us" viewBox="0 0 512 512">
    <g fillRule="evenodd">
        <g strokeWidth="1pt">
            <path fill="#bd3d44" d="M0 0h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8V197H0zm0 78.8h972.8v39.4H0zm0 78.8h972.8v39.4H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8V512H0z" />
            <path fill="#fff" d="M0 39.4h972.8v39.4H0zm0 78.8h972.8v39.3H0zm0 78.7h972.8v39.4H0zm0 78.8h972.8V315H0zm0 78.8h972.8v39.3H0zm0 78.7h972.8v39.4H0z" />
        </g>
        <path fill="#192f5d" d="M0 0h389.1v275.7H0z" />
        <path fill="#fff" d="m32.3 11.8 4 11h11l-9.1 6.7 3.5 10.7-9.4-6.7-8.7 6.7 3.6-10.7-9.5-6.7h11.8zm65 0 3.5 11h11.4l-9.4 6.7 4 10.7-9.5-6.7-9.5 6.7 4-10.7-9.5-6.7h11.4zm65 0 3.5 11h11.4l-9.4 6.7 4 10.7-9.5-6.7-9.5 6.7 4-10.7-9.5-6.7h11.4zm64.6 0 3.9 11h11l-9 6.7 3.5 10.7-9.4-6.7-9.1 6.7 3.5-10.7-9.4-6.7h11.8zm65 0 3.5 11h11.4l-9.4 6.7 3.9 10.7-9.9-6.7-9 6.7 3.5-10.7-9.4-6.7h11.4zm65 0 3.5 11h11.4l-9.5 6.7 4 10.7-9.5-6.7-9.4 6.7 4-10.7-9.5-6.7h11.4zm-292 27.6 3.6 11H80l-9.5 6.7 4 10.6L65 61l-9.5 6.7 4-10.6-9.5-6.7h11.4zm64.7 0 4 11h11l-9.1 6.7 3.5 10.6-9.4-6.7-9 6.7 3.5-10.6-9.5-6.7h11.8zm65 0 3.5 11h11.4l-9.4 6.7 4 10.6-9.5-6.7-9.5 6.7 4-10.6-9.5-6.7H191zm65 0 3.5 11h11.4l-9.4 6.7 3.9 10.6-9.5-6.7-9.4 6.7 4-10.6-9.5-6.7H256zm64.5 0 4 11h10.6l-9 6.7 3.5 10.6-9.5-6.7-9 6.7 3.5-10.6-9.4-6.7h11.8zM32.7 67l3.1 11h11.9l-9.5 6.7 3.5 10.6-9.4-6.7-8.7 6.7 3.6-10.6-9.5-6.7h11.8zm64.6 0 3.5 11h11.4l-9 6.7 3.5 10.6-9.4-6.7-9 6.7 3.5-10.6-9.5-6.7h11.4zm65 0 3.5 11h11.4l-9.4 6.7 4 10.6-9.5-6.7-9.5 6.7 4-10.6-9.5-6.7h11.4zm64.6 0 3.9 11h11l-9 6.7 3.5 10.6-9.4-6.7-9.1 6.7 3.5-10.6L212 78h11.8zm65 0 3.5 11h11.4l-9 6.7 3.5 10.6-9.5-6.7-9 6.7 3.5-10.6L277 78h11.4zm65 0 3.5 11h11.4l-9.5 6.7 4 10.6-9.5-6.7-9.4 6.7 4-10.6-9.5-6.7h11.4zm-292 27.5 3.6 11H80l-9.5 6.7 4 10.7-9.5-6.7-9.5 6.7 4-10.7-9.5-6.6h11.4zm64.7 0 4 11h11l-9.1 6.7L139 123l-9.4-6.7-9 6.7 3.5-10.7-9.5-6.6h11.8zm65 0 3.5 11h11.4l-9 6.7L204 123l-9.4-6.7-9.1 6.7 3.5-10.7-9.4-6.6H191zm65 0 3.5 11h11.4l-9.4 6.7L269 123l-9.5-6.7-9.4 6.7 4-10.7-9.5-6.6H256zm64.5 0 4 11h10.6l-9 6.7 3.5 10.7-9.5-6.7-9 6.7 3.5-10.7-9.4-6.6h11.8zM32.7 122.1l3.1 11h11.9l-9.5 6.7 3.5 10.7-9.4-6.7-8.7 6.7 3.6-10.7-9.5-6.7h11.8zm64.6 0 3.5 11h11.4l-9 6.7 3.5 10.7-9.4-6.7-9 6.7 3.5-10.7-9.5-6.7h11.4zm65 0 3.5 11h11.4l-9.4 6.7 4 10.7-9.5-6.7-9.5 6.7 4-10.7-9.5-6.7h11.4zm64.6 0 3.9 11h11l-9 6.7 3.5 10.7-9.4-6.7-9.1 6.7 3.5-10.7-9.4-6.7h11.8zm65 0 3.5 11h11.4l-9 6.7 3.5 10.7-9.5-6.7-9 6.7 3.5-10.7-9.4-6.7h11.4zm65 0 3.5 11h11.4l-9.5 6.7 4 10.7-9.5-6.7-9.4 6.7 4-10.7-9.5-6.7h11.4zm-292 27.6 3.6 11H80l-9.5 6.7 4 10.6-9.5-6.7-9.5 6.7 4-10.6-9.5-6.7h11.4zm64.7 0 4 11h11l-9.1 6.7L139 178l-9.4-6.7-9 6.7 3.5-10.6-9.5-6.7h11.8zm65 0 3.5 11h11.4l-9 6.7L204 178l-9.4-6.7-9.1 6.7 3.5-10.6-9.4-6.7H191zm65 0 3.5 11h11.4l-9.4 6.7L269 178l-9.5-6.7-9.4 6.7 4-10.6-9.5-6.7H256zm64.5 0 4 11h10.6l-9 6.7 3.5 10.6-9.5-6.7-9 6.7 3.5-10.6-9.4-6.7h11.8zM32.7 177.2l3.1 11h11.9l-9.5 6.8 3.5 10.6-9.4-6.7-8.7 6.7 3.6-10.6-9.5-6.7h11.8zm64.6 0 3.5 11h11.4l-9 6.8 3.5 10.6-9.4-6.7-9 6.7 3.5-10.6-9.5-6.7h11.4zm65 0 3.5 11h11.4l-9.4 6.8 4 10.6-9.5-6.7-9.5 6.7 4-10.6-9.5-6.7h11.4zm64.6 0 3.9 11h11l-9 6.8 3.5 10.6-9.4-6.7-9.1 6.7 3.5-10.6-9.4-6.7h11.8zm65 0 3.5 11h11.4l-9 6.8 3.5 10.6-9.5-6.7-9 6.7 3.5-10.6-9.4-6.7h11.4zm65 0 3.5 11h11.4l-9.5 6.8 4 10.6-9.5-6.7-9.4 6.7 4-10.6-9.5-6.7h11.4zm-292 27.6 3.6 11H80l-9.5 6.7 4 10.7-9.5-6.7-9.5 6.7 4-10.7-9.5-6.7h11.4zm64.7 0 4 11h11l-9.1 6.7 3.5 10.7-9.4-6.7-9 6.7 3.5-10.7-9.5-6.7h11.8zm65 0 3.5 11h11.4l-9 6.7 3.5 10.7-9.4-6.7-9.1 6.7 3.5-10.7-9.4-6.7H191zm65 0 3.5 11h11.4l-9.4 6.7 3.9 10.7-9.5-6.7-9.4 6.7 4-10.7-9.5-6.7H256zm64.5 0 4 11h10.6l-9 6.7 3.5 10.7-9.5-6.7-9 6.7 3.5-10.7-9.4-6.7h11.8zM32.7 232.4l3.1 11h11.9l-9.5 6.7 3.5 10.6-9.4-6.7-8.7 6.7 3.6-10.6-9.5-6.7h11.8zm64.6 0 3.5 11h11.4l-9 6.7 3.5 10.6-9.4-6.7-9 6.7 3.5-10.6-9.5-6.7h11.4zm65 0 3.5 11h11.4l-9.4 6.7 4 10.6-9.5-6.7-9.5 6.7 4-10.6-9.5-6.7h11.4zm64.6 0 3.9 11h11l-9 6.7 3.5 10.6-9.4-6.7-9.1 6.7 3.5-10.6-9.4-6.7h11.8zm65 0 3.5 11h11.4l-9 6.7 3.5 10.6-9.5-6.7-9 6.7 3.5-10.6-9.4-6.7h11.4zm65 0 3.5 11h11.4l-9.5 6.7 4 10.6-9.5-6.7-9.4 6.7 4-10.6-9.5-6.7h11.4z" />
    </g>
</svg>)

const IconEN = () => (<Icon component={EnFlag} size={32} />);

const ChangeLanguageEL = observer(({ ui }) => {
    const lang = ui.lang;

    const iconsByLang = {
        'ru': <IconRU />,
        'ru-RU': <IconRU />,
        'en': <IconEN />
    }

    const onLangSelect = (item) => {
        ui.changeLanguage(item.key)
    }

    const menu = (
        <Menu onSelect={onLangSelect}
            selectable
            items={[
                {
                    key: 'ru',
                    icon: <IconRU />,
                },
                {
                    key: 'en',
                    icon: <IconEN />,
                }]}
        />
    );

    return <Dropdown overlay={menu}>
        <Button onClick={(e) => e.preventDefault()}
            icon={iconsByLang[lang]}
            shape="circle"
            size='large'
        ></Button>
    </Dropdown>
})

export default HeaderComponent;