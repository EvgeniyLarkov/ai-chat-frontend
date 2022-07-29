import React, {
  useEffect,
  useState,
} from 'react';

import {
  Col,
  Modal,
  Progress,
  Row,
  Space,
  Typography,
} from 'antd';
import { observer } from 'mobx-react-lite';

import { CheckCircleTwoTone } from '@ant-design/icons';

import { availableModals } from '../../../storage/ui';

const RegisterConfirmationModal = observer(({ ui }) => {
    const timerOffset = 5000;
    const [counter, setCounter] = useState(timerOffset);

    useEffect(() => {
        console.log('start timer', ui.currentModal)
        const timer = setInterval(() => {
            setCounter(counter => counter - 50);
        }, 50);
        return () => clearInterval(timer);
    }, [])

    useEffect(() => {
        if (counter === 0) {
            ui.closeModal();
        }
    }, [ui, counter])

    return (
        <Modal
            visible={ui.currentModal === availableModals.registerConfirmation}
            footer={null}
            onCancel={() => ui.closeModal()}
        >
            <Col>
                <Space
                    direction="vertical"
                    size="middle"
                    style={{
                        display: 'flex',
                    }}
                >
                    <Row align="middle" justify="center">
                        <CheckCircleTwoTone style={{ fontSize: '64px' }}/>
                    </Row>
                    <Row align="middle" justify="center"><Typography>Регистрация прошла успешно</Typography></Row>
                    <Progress
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                            percent={Math.round(((timerOffset - counter)/timerOffset)*100)}
                            showInfo={false}
                        />
                </Space>
            </Col>
        </Modal>
    );
})

export default RegisterConfirmationModal;