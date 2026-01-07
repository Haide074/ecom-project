/**
 * Admin Service
 * API calls for admin operations
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
// AUTHENTICATION DISABLED - No token required
const getAuthHeaders = () => {
    // const token = localStorage.getItem('token');
    // return {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // };
    return {}; // Return empty object - no auth headers needed
};

// Dashboard
export const getDashboardStats = async (period = 30) => {
    const response = await axios.get(`${API_URL}/admin/dashboard?period=${period}`, getAuthHeaders());
    return response.data;
};

// Products
export const getAllProducts = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_URL}/admin/products?${queryString}`, getAuthHeaders());
    return response.data;
};

export const createProduct = async (formData) => {
    const response = await axios.post(`${API_URL}/products`, formData, {
        ...getAuthHeaders(),
        headers: {
            ...getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateProduct = async (id, formData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        ...getAuthHeaders(),
        headers: {
            ...getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/products/${id}`, getAuthHeaders());
    return response.data;
};

export const updateProductStatus = async (id, status) => {
    const response = await axios.put(
        `${API_URL}/admin/products/${id}/status`,
        { status },
        getAuthHeaders()
    );
    return response.data;
};

export const toggleProductFeatured = async (id) => {
    const response = await axios.put(`${API_URL}/admin/products/${id}/featured`, {}, getAuthHeaders());
    return response.data;
};

export const deleteProductImage = async (productId, imageId) => {
    const response = await axios.delete(
        `${API_URL}/products/${productId}/images/${imageId}`,
        getAuthHeaders()
    );
    return response.data;
};

// Categories
export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/admin/categories`, getAuthHeaders());
    return response.data;
};

export const createCategory = async (data) => {
    const response = await axios.post(`${API_URL}/admin/categories`, data, getAuthHeaders());
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await axios.put(`${API_URL}/admin/categories/${id}`, data, getAuthHeaders());
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/admin/categories/${id}`, getAuthHeaders());
    return response.data;
};

// Users
export const getAllUsers = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_URL}/admin/users?${queryString}`, getAuthHeaders());
    return response.data;
};

export const toggleBlockUser = async (id) => {
    const response = await axios.put(`${API_URL}/admin/users/${id}/block`, {}, getAuthHeaders());
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await axios.put(`${API_URL}/admin/users/${id}/role`, { role }, getAuthHeaders());
    return response.data;
};

// Activity Logs
export const getActivityLogs = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`${API_URL}/admin/activity-logs?${queryString}`, getAuthHeaders());
    return response.data;
};

// Coupons
export const getCoupons = async () => {
    const response = await axios.get(`${API_URL}/admin/coupons`, getAuthHeaders());
    return response.data;
};

export const createCoupon = async (data) => {
    const response = await axios.post(`${API_URL}/admin/coupons`, data, getAuthHeaders());
    return response.data;
};
