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
    FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VNPayIcon from '../assets/vnpay.svg';
import MoMoIcon from '../assets/momo.svg';

const PaymentIcon = styled('img')({
    width: '40px',
    height: '40px',
    marginRight: '10px'
});

const PaymentOption = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    }
}));

const PaymentMethodModal = ({ open, onClose, onConfirm, loading }) => {
    const [paymentMethod, setPaymentMethod] = React.useState('vnpay');

    const handleChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleConfirm = () => {
        onConfirm(paymentMethod);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chọn phương thức thanh toán</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Phương thức thanh toán</FormLabel>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={handleChange}
                    >
                        <PaymentOption>
                            <FormControlLabel
                                value="vnpay"
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PaymentIcon src={VNPayIcon} alt="VNPay" />
                                        <Typography>Thanh toán qua VNPay</Typography>
                                    </Box>
                                }
                            />
                        </PaymentOption>
                        <PaymentOption>
                            <FormControlLabel
                                value="momo"
                                control={<Radio />}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <PaymentIcon src={MoMoIcon} alt="MoMo" />
                                        <Typography>Thanh toán qua MoMo</Typography>
                                    </Box>
                                }
                            />
                        </PaymentOption>
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PaymentMethodModal; 