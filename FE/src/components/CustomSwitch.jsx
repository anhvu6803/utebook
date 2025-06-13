import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const WIDTH = 60;
const HEIGHT = 30;

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: WIDTH,
    height: HEIGHT,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: `translateX(${WIDTH - HEIGHT}px)`,
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#7FADDD',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45',
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: HEIGHT - 4,
        height: HEIGHT - 4,
    },
    '& .MuiSwitch-track': {
        borderRadius: HEIGHT / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
        }),
    },
}));

export default function CustomSwitch({ showSpan = true }) {
    return (

        <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
            label={
                showSpan &&
                <span style={{ fontSize: '15px' }} >
                    Đặt làm địa chỉ mặc định
                </ span>
            }

        />

    );
}