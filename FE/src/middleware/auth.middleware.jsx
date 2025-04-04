import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { decodeToken } from '../utils/token';

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

    // Kiểm tra access token trong cookie
    const token = getTokenFromCookie();
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Decode token để kiểm tra
    const decoded = decodeToken(token);
    if (!decoded || !decoded.userId) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Kiểm tra quyền admin nếu cần
    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AuthMiddleware; 