import axios from 'axios';
import { API_BASE_PATH } from '@/context/constants';

// Configuração base do axios
const apiClient = axios.create({
  baseURL: API_BASE_PATH || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('auth-token');
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

function HttpClient() {
  return {
    get: apiClient.get,
    post: apiClient.post,
    patch: apiClient.patch,
    put: apiClient.put,
    delete: apiClient.delete,
    // Métodos adicionais
    request: apiClient.request,
    // Configurações
    setBaseURL: (url) => {
      apiClient.defaults.baseURL = url;
    },
    setAuthToken: (token) => {
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    }
  };
}

export default HttpClient();