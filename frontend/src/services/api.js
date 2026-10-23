import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8004/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobshield_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login/') &&
      !originalRequest.url.includes('/auth/refresh/')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('jobshield_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          if (res.data && res.data.access) {
            localStorage.setItem('jobshield_access_token', res.data.access);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('jobshield_access_token');
          localStorage.removeItem('jobshield_refresh_token');
          localStorage.removeItem('jobshield_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Modular API Services
export const authAPI = {
  register: (data) => apiClient.post('/auth/register/', data),
  login: (data) => apiClient.post('/auth/login/', data),
  logout: () => apiClient.post('/auth/logout/'),
  getProfile: () => apiClient.get('/user/profile/'),
  updateProfile: (data) => apiClient.put('/user/profile/', data),
};

export const analysisAPI = {
  analyze: (data) => apiClient.post('/analysis/', data),
  getHistory: (params) => apiClient.get('/analysis/', { params }),
  getDetail: (id) => apiClient.get(`/analysis/${id}/`),
  deleteAnalysis: (id) => apiClient.delete(`/analysis/${id}/`),
};

export const verificationAPI = {
  verifyCompany: (data) => apiClient.post('/verification/company/', data),
  verifyRecruiter: (data) => apiClient.post('/verification/recruiter/', data),
  predictML: (data) => apiClient.post('/ml/predict/', data),
  calculateRisk: (data) => apiClient.post('/risk/calculate/', data),
};

export const reportsAPI = {
  generate: (analysisId) => apiClient.post('/reports/generate/', { analysis_id: analysisId }, { responseType: 'blob' }),
  download: (analysisId) => apiClient.get(`/reports/${analysisId}/`, { responseType: 'blob' }),
};

export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats/'),
};

export const adminAPI = {
  getStats: () => apiClient.get('/admin/stats/'),
};

export default apiClient;
