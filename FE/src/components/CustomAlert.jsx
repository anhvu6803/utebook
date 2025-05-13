import React from "react";
import "./styles/AccountInfoTab.scss";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const CustomAlert = ({ alert, handleCloseAlert }) => {
    return (
        <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            sx={{
                left: '10px !important',
                bottom: '30px !important'
            }}
        >
            <Alert
                onClose={handleCloseAlert}
                severity={alert.severity}
                sx={{ width: '100%' }}
            >
                {alert.message}
            </Alert>
        </Snackbar>
    );
};

export default CustomAlert;