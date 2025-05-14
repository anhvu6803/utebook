import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VNPayIcon from '../assets/vnpay.png';
import MoMoIcon from '../assets/momo.png';

const PaymentIcon = styled('img')({
    width: '48px',
    height: '48px',
    marginRight: '16px',
    objectFit: 'contain'
});

const PaymentOption = styled(Box)(({ theme, selected }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2.5),
    border: '2px solid',
    borderColor: selected ? theme.palette.primary.main : theme.palette.divider,
    borderRadius: theme.shape.borderRadius * 1.5,
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: selected ? theme.palette.primary.light + '15' : 'transparent',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '10',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(1)
    }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    fontSize: '1.5rem',
    fontWeight: 600,
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3)
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.divider}`
}));

const PaymentMethodModal = ({ open, onClose, onConfirm, loading }) => {
    const theme = useTheme();
    const [paymentMethod, setPaymentMethod] = React.useState('vnpay');

    const handleChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleConfirm = () => {
        onConfirm(paymentMethod);
    };

    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <StyledDialogTitle>Chọn phương thức thanh toán</StyledDialogTitle>
            <StyledDialogContent>
                <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend" sx={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 500,
                        color: theme.palette.text.primary,
                        marginBottom: 2
                    }}>
                        Phương thức thanh toán
                    </FormLabel>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={handleChange}
                    >
                        <PaymentOption selected={paymentMethod === 'vnpay'}>
                            <FormControlLabel
                                value="vnpay"
                                control={<Radio color="primary" />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PaymentIcon src={VNPayIcon} alt="VNPay" />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                Thanh toán qua VNPay
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Thanh toán an toàn và nhanh chóng
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                                sx={{ margin: 0, width: '100%' }}
                            />
                        </PaymentOption>
                        <PaymentOption selected={paymentMethod === 'momo'}>
                            <FormControlLabel
                                value="momo"
                                control={<Radio color="primary" />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PaymentIcon src={MoMoIcon} alt="MoMo" />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                                Thanh toán qua MoMo
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Thanh toán nhanh chóng qua ví MoMo
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                                sx={{ margin: 0, width: '100%' }}
                            />
                        </PaymentOption>
                    </RadioGroup>
                </FormControl>
            </StyledDialogContent>
            <StyledDialogActions>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3
                    }}
                >
                    Hủy
                </Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                    sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3
                    }}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
            </StyledDialogActions>
        </StyledDialog>
    );
};

export default PaymentMethodModal; 