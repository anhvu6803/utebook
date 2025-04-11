import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true 
});

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        console.log('Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.config.method.toUpperCase(), response.config.url);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.error('Response error:', error.response?.status, error.config?.method?.toUpperCase(), error.config?.url);

        // Nếu lỗi là 401 và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            console.log('Attempting to refresh token...');
            isRefreshing = true;
            originalRequest._retry = true;

            try {
                // Gọi API refresh token
                const refreshResponse = await instance.post('/auth/refresh-token');
                console.log('Token refresh successful');
                isRefreshing = false;
                
                // Thử lại request gốc
                return instance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                isRefreshing = false;
                // Nếu refresh token thất bại, xóa cookie và chuyển hướng về trang login
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Nếu đang trong quá trình refresh hoặc đã thử refresh rồi, chuyển hướng về login
        if (error.response?.status === 401 && (isRefreshing || originalRequest._retry)) {
            console.log('Token refresh in progress or already attempted, redirecting to login');
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // Xử lý các lỗi khác
        if (error.response) {
            console.error('Error response:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }

        return Promise.reject(error);
    }
);

export default instance; 