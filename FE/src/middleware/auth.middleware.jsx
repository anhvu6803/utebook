import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { decodeToken } from '../utils/token';
import axios from '../utils/axios';
import { useState, useEffect } from 'react';

const getTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'access_token') {
            return value;
        }
    }
    return null;
};

const AuthMiddleware = ({ children, requireAdmin = false }) => {
    const { user } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Kiểm tra access token trong cookie
                const token = getTokenFromCookie();
                if (!token) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Decode token để kiểm tra
                const decoded = decodeToken(token);
                if (!decoded || !decoded.userId) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Kiểm tra token hết hạn
                const currentTime = Math.floor(Date.now() / 1000);
                if (decoded.exp < currentTime) {
                    // Token hết hạn, thử refresh
                    try {
                        await axios.post('/auth/refresh-token');
                        setIsAuthenticated(true);
                    } catch (error) {
                        // Refresh thất bại
                        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        setIsAuthenticated(false);
                    }
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return null; // Hoặc có thể return một loading component
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền admin nếu cần
    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AuthMiddleware; 