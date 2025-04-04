import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true 
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi là 401 và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Thử refresh token
                await instance.post('/auth/refresh-token');
                
                // Nếu refresh thành công, thử lại request gốc
                return instance(originalRequest);
            } catch (refreshError) {
                // Nếu refresh thất bại (token hết hạn hoặc không tồn tại), chuyển hướng về trang login
                if (refreshError.response?.status === 401) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance; 