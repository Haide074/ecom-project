import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
        const { state } = JSON.parse(authData);
        if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
        }
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getFeatured: () => api.get('/products/featured'),
    getBySlug: (slug) => api.get(`/products/${slug}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (productId, quantity) => api.post('/cart', { productId, quantity }),
    update: (productId, quantity) => api.put('/cart', { productId, quantity }),
    remove: (productId) => api.delete(`/cart/${productId}`),
    clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Guest Orders API (no authentication required)
export const guestOrdersAPI = {
    create: (data) => api.post('/guest-orders', data),
    getAllForAdmin: (params) => api.get('/guest-orders/all', { params }),
    updateStatus: (id, data) => api.put(`/guest-orders/${id}/status`, data),
};

export default api;
