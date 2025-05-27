import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true 
});

// Biến để theo dõi trạng thái refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        // Lấy token từ cookie
        const token = document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Gọi API refresh token
                await instance.post('/auth/refresh-token');
                isRefreshing = false;
                
                // Thử lại request gốc
                return instance(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                processQueue(refreshError, null);
                
                // Xóa cookie và chuyển hướng về trang login
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Nếu đang trong quá trình refresh, thêm request vào queue
        if (error.response?.status === 401 && isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
            .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
            })
            .catch(err => {
                return Promise.reject(err);
            });
        }

        return Promise.reject(error);
    }
);

export default instance; 