import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [email, setEmail] = useState(null);
    const [userId, setUserId] = useState(null);

    const refreshToken = async () => {
        try {
            const response = await axios.post('/auth/refresh-token', {}, {
                withCredentials: true
            });
            
            if (response.data?.user) {
                setUser(response.data.user);
                const decoded = decodeToken(response.data.accessToken);
                if (decoded) {
                    setIsAdmin(decoded.isAdmin === true);
                    setEmail(decoded.email);
                    setUserId(decoded.userId);
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // Clear all auth data on refresh failure
            setUser(null);
            setIsAdmin(false);
            setEmail(null);
            setUserId(null);
            return false;
        }
    };

    const checkTokenExpiration = (token) => {
        try {
            const decoded = decodeToken(token);
            if (!decoded || !decoded.exp) return true;
            
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp <= currentTime;
        } catch (err) {
            console.error('Error checking token expiration:', err);
            return true;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getTokenFromCookie();
                
                if (!token) {
                    setLoading(false);
                    return;
                }

                const isExpired = checkTokenExpiration(token);
                if (isExpired) {
                    const refreshed = await refreshToken();
                    if (!refreshed) {
                        setUser(null);
                        setIsAdmin(false);
                        setEmail(null);
                        setUserId(null);
                        setLoading(false);
                        return;
                    }
                } else {
                    const decoded = decodeToken(token);
                    if (decoded) {
                        setIsAdmin(decoded.isAdmin === true);
                        setEmail(decoded.email);
                        setUserId(decoded.userId);
                        try {
                            const response = await axios.get(`/auth/get-me/${decoded.userId}`, {
                                withCredentials: true
                            });
                            if (response.data) {
                                setUser(response.data);
                            }
                        } catch (error) {
                            console.error('Error fetching user data:', error);
                            if (error.response?.status === 401) {
                                const refreshed = await refreshToken();
                                if (!refreshed) {
                                    setUser(null);
                                    setIsAdmin(false);
                                    setEmail(null);
                                    setUserId(null);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setUser(null);
                setIsAdmin(false);
                setEmail(null);
                setUserId(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

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

    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (err) {
            console.error('Error decoding token:', err);
            return null;
        }
    };

    const value = {
        user,
        loading,
        isAdmin,
        email,
        userId,
        setUser: (newUser) => {
            setUser(newUser);
            if (newUser?.isAdmin !== undefined) {
                setIsAdmin(newUser.isAdmin === true);
            }
            if (newUser?.email) {
                setEmail(newUser.email);
            }
            if (newUser?.userId) {
                setUserId(newUser.userId);
            }
        },
        refreshToken
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 