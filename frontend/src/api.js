import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

// Healthcheck
export const checkHealth = () => api.get('/health');

// 1. Thêm giao dịch
export const addTransaction = (data) => api.post('/transactions', data);

// 2. Xem danh sách (có lọc theo ngày và loại)
export const getTransactions = (params = {}) => api.get('/transactions', { params });

// 3. Tính tổng theo thời gian
export const getSummary = (params = {}) => api.get('/transactions/summary', { params });

// 4. Xóa giao dịch
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export default api;
