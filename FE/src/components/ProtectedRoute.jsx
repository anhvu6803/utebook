import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import { useState, useEffect } from 'react';
import Loading from './Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, setUser, isAdmin, refreshToken } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                console.log('Checking auth for route:', location.pathname);
                const response = await axios.get('/auth/me', {
                    withCredentials: true
                });
                
                if (isMounted && response.data) {
                    console.log('User data from /auth/me:', response.data);
                    setUser(response.data);
                    setIsAuthenticated(true);
                } else {
                    throw new Error('Invalid user data');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                
                if (isMounted) {
                    if (error.response?.status === 401) {
                        console.log('Token expired, attempting refresh...');
                        const refreshed = await refreshToken();
                        if (refreshed) {
                            console.log('Token refresh successful');
                            setIsAuthenticated(true);
                            return;
                        }
                        
                        // Try one more time before giving up
                        console.log('First refresh failed, trying one more time...');
                        const refreshedAgain = await refreshToken();
                        if (refreshedAgain) {
                            console.log('Second refresh successful');
                            setIsAuthenticated(true);
                            return;
                        }
                    }
                    console.log('Auth failed after all attempts, redirecting to login');
                    setIsAuthenticated(false);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Check if we're on a public route and have access token
        const isPublicRoute = ['/', '/login', '/register', '/forgot-password', '/change-password'].includes(location.pathname);
        const hasAccessToken = document.cookie.includes('access_token');

        if (isPublicRoute && hasAccessToken) {
            console.log('On public route with access token, attempting refresh...');
            refreshToken().then(refreshed => {
                if (refreshed && isMounted) {
                    console.log('Token refresh successful on public route, redirecting to /utebook');
                    window.location.href = '/utebook';
                } else {
                    checkAuth();
                }
            });
        } else {
            checkAuth();
        }

        return () => {
            isMounted = false;
        };
    }, [location.pathname]);

    if (isLoading) {
        return <Loading />;
    }

    // If user is authenticated and trying to access public routes, redirect to home
    if (isAuthenticated && ['/', '/login', '/register', '/forgot-password', '/change-password'].includes(location.pathname)) {
        console.log('User is authenticated, redirecting to /utebook');
        return <Navigate to="/utebook" replace />;
    }

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        console.log('Admin access required, redirecting to home. Current isAdmin:', isAdmin);
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute; 