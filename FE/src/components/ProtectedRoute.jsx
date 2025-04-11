import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import { useState, useEffect } from 'react';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, setUser } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Thử lấy thông tin user hiện tại
                const response = await axios.get('/auth/me', {
                    withCredentials: true
                });
                
                if (response.data) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                } else {
                    throw new Error('Invalid user data');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                
                // Nếu lỗi 401, thử refresh token
                if (error.response?.status === 401) {
                    try {
                        const refreshResponse = await axios.post('/auth/refresh-token', {}, {
                            withCredentials: true
                        });
                        
                        if (refreshResponse.data?.user) {
                            setUser(refreshResponse.data.user);
                            setIsAuthenticated(true);
                            return;
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                    }
                }
                
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [setUser]);

    if (isLoading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền admin nếu cần
    if (requireAdmin && user?.role !== 'admin') {
        console.log('Admin access required, redirecting to home');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute; 