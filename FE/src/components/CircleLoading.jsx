import React from 'react';
import { Flex, Spin, ConfigProvider } from 'antd';
const CircleLoading = ({ size, spinning = true, colorPrimary = '#005bbb' }) => (
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
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            <Spin size='large' spinning={spinning}/>
        </Flex>
    </ConfigProvider >
);
export default CircleLoading;