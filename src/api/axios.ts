import axios from "axios"

const api = axios.create({baseURL:'https://route-posts.routemisr.com'})

api.interceptors.request.use((config) => {
    if (config.url?.includes('/login') || config.url?.includes('/register')) {
        return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.token = token; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api