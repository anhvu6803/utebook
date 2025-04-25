import React from 'react';
import { Flex, Spin, ConfigProvider } from 'antd';
const CircleLoading = ({ size, colorPrimary = '#005bbb' }) => (
    <ConfigProvider
        theme={{
            components: {
                Spin: {
                    dotSizeLG: size,
                    colorPrimary: colorPrimary
                },
            }
        }}
    >
        <Flex
            align="center"
            gap="middle"
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <Spin size='large' />
        </Flex>
    </ConfigProvider >
);
export default CircleLoading;