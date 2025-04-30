import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from './Loading';
import axios from 'axios';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Checking auth for public route...');
                // Gọi API /me để kiểm tra token
                console.log('Calling /api/auth/me...');
                const response = await axios.get('http://localhost:5000/api/auth/me', { 
                    withCredentials: true 
                });
                console.log('API response:', response.data);
                
                if (response.data) {
                    console.log('User is authenticated, redirecting to /utebook');
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.log('User is not authenticated:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    // Nếu người dùng đã đăng nhập, chuyển hướng đến /utebook
    if (isAuthenticated) {
        return <Navigate to="/utebook" state={{ from: location }} replace />;
    }

    return children;
};

PublicRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PublicRoute;
