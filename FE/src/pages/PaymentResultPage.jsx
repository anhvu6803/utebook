import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PaymentResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [transactionId, setTransactionId] = useState(null);

    useEffect(() => {
        const pathname = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('transactionId');

        // Xác định trạng thái thanh toán từ URL
        const status = pathname.includes('success') ? 'success' : 'failed';
        
        setPaymentStatus(status);
        setTransactionId(id);
        setLoading(false);
    }, [location]);

    const handleBackToHome = () => {
        navigate('/utebook');
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'background.paper'
                }}
            >
                {paymentStatus === 'success' ? (
                    <>
                        <CheckCircleIcon
                            sx={{
                                fontSize: 80,
                                color: 'success.main',
                                mb: 2
                            }}
                        />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Thanh toán thành công!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Giao dịch của bạn đã được xử lý thành công.
                        </Typography>
                    </>
                ) : (
                    <>
                        <CancelIcon
                            sx={{
                                fontSize: 80,
                                color: 'error.main',
                                mb: 2
                            }}
                        />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Thanh toán thất bại
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần giúp đỡ.
                        </Typography>
                    </>
                )}

                {transactionId && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Mã giao dịch: {transactionId}
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBackToHome}
                    sx={{ mt: 4 }}
                >
                    Quay về trang chủ
                </Button>
            </Box>
        </Container>
    );
};

export default PaymentResultPage;
