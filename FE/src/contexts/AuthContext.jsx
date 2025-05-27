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

    // Function to update auth state and sync with sessionStorage
    const updateAuthState = (newUser, newIsAdmin, newEmail, newUserId) => {
        console.log("Updating auth state:", { newUser, newIsAdmin, newEmail, newUserId });
        setUser(newUser);
        setIsAdmin(newIsAdmin);
        setEmail(newEmail);
        // Use user._id if newUserId is not provided
        setUserId(newUserId || (newUser?._id));
        
        // Only store non-sensitive data in sessionStorage
        if (newUser) {
            sessionStorage.setItem('authState', JSON.stringify({
                isAdmin: newIsAdmin,
                email: newEmail,
                userId: newUserId || newUser._id,
                // Only store non-sensitive user data
                user: {
                    name: newUser.name,
                    avatar: newUser.avatar
                }
            }));
        }
    };

    // Function to clear auth state and sessionStorage
    const clearAuthState = () => {
        setUser(null);
        setIsAdmin(false);
        setEmail(null);
        setUserId(null);
        sessionStorage.removeItem('authState');
    };

    // Listen for storage events from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'authState') {
                if (e.newValue) {
                    const authState = JSON.parse(e.newValue);
                    // Only update non-sensitive data from storage
                    setIsAdmin(authState.isAdmin);
                    setEmail(authState.email);
                    setUserId(authState.userId);
                    setUser(prevUser => ({
                        ...prevUser,
                        name: authState.user.name,
                        avatar: authState.user.avatar
                    }));
                } else {
                    clearAuthState();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Check sessionStorage on mount
    useEffect(() => {
        const storedAuth = sessionStorage.getItem('authState');
        if (storedAuth) {
            const authState = JSON.parse(storedAuth);
            // Only restore non-sensitive data
            setIsAdmin(authState.isAdmin);
            setEmail(authState.email);
            setUserId(authState.userId);
            setUser(prevUser => ({
                ...prevUser,
                name: authState.user.name,
                avatar: authState.user.avatar
            }));
        }
        setLoading(false);
    }, []);

    const refreshToken = async () => {
        try {
            console.log("Refreshing token...");
            const response = await axios.post('/auth/refresh-token', {}, {
                withCredentials: true
            });
            
            if (response.data?.user) {
                const decoded = decodeToken(response.data.accessToken);
                console.log("Decoded token:", decoded);
                if (decoded) {
                    // Update auth state with new user data and token info
                    updateAuthState(
                        response.data.user,
                        decoded.isAdmin === true,
                        decoded.email,
                        response.data.user._id // Use user._id from response
                    );
                    console.log("Auth state updated after refresh");
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            clearAuthState();
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
                        clearAuthState();
                        setLoading(false);
                        return;
                    }
                } else {
                    const decoded = decodeToken(token);
                    if (decoded) {
                        try {
                            const response = await axios.get(`/auth/get-me/${decoded.userId}`, {
                                withCredentials: true
                            });
                            if (response.data) {
                                updateAuthState(
                                    response.data,
                                    decoded.isAdmin === true,
                                    decoded.email,
                                    response.data._id // Use user._id from response
                                );
                            }
                        } catch (error) {
                            console.error('Error fetching user data:', error);
                            if (error.response?.status === 401) {
                                const refreshed = await refreshToken();
                                if (!refreshed) {
                                    clearAuthState();
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                clearAuthState();
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
            updateAuthState(
                newUser,
                newUser?.isAdmin === true,
                newUser?.email,
                newUser?._id // Use user._id when setting user
            );
        },
        refreshToken,
        clearAuthState
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