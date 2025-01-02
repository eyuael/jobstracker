import axios from 'axios';
import { JobApplication } from '../../server/src/types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
};

export const getApplications = async () => {
    const response = await api.get('/applications');
    return response.data;
};

export const createApplication = async (application: Omit<JobApplication, 'id'>) => {
    const response = await api.post('/applications', application);
    return response.data;
};

export const updateApplication = async (id: string, application: Omit<JobApplication, 'id'>) => {
    const response = await api.put(`/applications/${id}`, application);
    return response.data;
};

export const deleteApplication = async (id: string) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
};
