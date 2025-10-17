import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../types/Api';
import type { LoginResponse, ApiResponse, ProductDto } from '../types/Api';
import type { BulkUploadResponse } from '../types/BulkUploadResponse';
import type { PaymentDto } from '../types/Api';
import type { SellerDto } from '../types/Api';
import type {CreateBudgetDto} from '../types/Api.ts';

// Configuración base de axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Función genérica para hacer peticiones
export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Error en petición ${method} ${url}:`, error);
    throw error;
  }
};

// Servicios específicos
export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    return apiRequest<LoginResponse>('POST', API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
  },
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
  },
  refreshToken: async () => apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.REFRESH),
  logout: async () => apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
  getProfile: async () => apiRequest('GET', API_CONFIG.ENDPOINTS.AUTH.PROFILE),
};

export const productService = {
  getAll: async (params?: any) => {
    const resp = await apiRequest<ApiResponse<ProductDto[]>>(
      'GET',
      API_CONFIG.ENDPOINTS.PRODUCTS.LIST,
      undefined,
      { params }
    );
    return resp.data ?? [];
  },
  getById: async (id: string) =>
    apiRequest<ProductDto>('GET', API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL(id)),
  create: async (product: ProductDto) =>
    apiRequest<ProductDto>('POST', API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, product),
  update: async (id: string, product: ProductDto) =>
    apiRequest<ProductDto>('PUT', API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id), product),
  delete: async (id: string) =>
    apiRequest('DELETE', API_CONFIG.ENDPOINTS.PRODUCTS.DELETE(id)),
  getBySeller: async (sellerId: string) =>
    apiRequest<ApiResponse<ProductDto[]>>('GET', API_CONFIG.ENDPOINTS.PRODUCTS.BY_SELLER(sellerId)),
  bulkUpload: async (products: ProductDto[]): Promise<BulkUploadResponse> =>
    apiRequest<BulkUploadResponse>('POST', API_CONFIG.ENDPOINTS.PRODUCTS.BULK, { products }),
};

export const cartService = {
  getCart: async () => apiRequest('GET', API_CONFIG.ENDPOINTS.CART.GET),
  addItem: async (productId: string, quantity: number) =>
    apiRequest('POST', API_CONFIG.ENDPOINTS.CART.ADD, { productId, quantity }),
  updateItem: async (itemId: string, quantity: number) =>
    apiRequest('PUT', API_CONFIG.ENDPOINTS.CART.UPDATE(itemId), { quantity }),
  removeItem: async (itemId: string) =>
    apiRequest('DELETE', API_CONFIG.ENDPOINTS.CART.REMOVE(itemId)),
  clearCart: async () => apiRequest('DELETE', API_CONFIG.ENDPOINTS.CART.CLEAR),
};

export const paymentService = {
  createPayment: async (paymentData: any) =>
    apiRequest('POST', API_CONFIG.ENDPOINTS.PAYMENTS.CREATE, paymentData),
  getPayments: async (params?: { page?: number; pageSize?: number }) => {
    const resp = await apiRequest<ApiResponse<PaymentDto[]>>(
      'GET',
      API_CONFIG.ENDPOINTS.PAYMENTS.LIST,
      undefined,
      { params }
    );
    return resp.data ?? [];
  },
  getPayment: async (id: string): Promise<PaymentDto> => {
    return apiRequest<PaymentDto>('GET', API_CONFIG.ENDPOINTS.PAYMENTS.DETAIL(id));
  },
  updatePayment: async (id: string, data: Partial<PaymentDto>) =>
    apiRequest('PUT', API_CONFIG.ENDPOINTS.PAYMENTS.UPDATE(id), data),
};


export const budgetService = {
  createBudget: async (budgetData: CreateBudgetDto) =>
    apiRequest<{ success: boolean; data: { id: number } }>(
        'POST',
        API_CONFIG.ENDPOINTS.BUDGETS.CREATE,
        budgetData
      ),
    getBudgets: async (filters?: {
      vendedor?: string;
      dateFrom?: string;
      dateTo?: string;
      rubro?: string;
    }) =>
      apiRequest('GET', API_CONFIG.ENDPOINTS.BUDGETS.LIST, undefined, { params: filters }),
    getBudget: async (id: string) =>
      apiRequest('GET', API_CONFIG.ENDPOINTS.BUDGETS.DETAIL(id)),
    getStats: async (filters?: {
      dateFrom?: string;
      dateTo?: string;
    }) =>
      apiRequest<{ success: boolean; data: any }>(
        "GET",
        API_CONFIG.ENDPOINTS.BUDGETS.STATS,
        undefined,
        { params: filters }
      ),

    deleteBudget: async (id: string) =>
      apiRequest('DELETE', API_CONFIG.ENDPOINTS.BUDGETS.DELETE(id)),
  };
  
export const sellerService = {
  getAll: async (all = false): Promise<SellerDto[]> => {
    const resp = await apiRequest<ApiResponse<SellerDto[]>>(
      'GET',
      all ? '/sellers?all=1' : '/sellers'
    );
    return resp.data ?? [];
  },
  create: async (seller: { nombre: string; apellido: string; numero_vendedor: number }) =>
    apiRequest('POST', '/sellers', seller),
  activate: async (id: number) => apiRequest('PATCH', `/sellers/${id}/activate`),
  deactivate: async (id: number) => apiRequest('PATCH', `/sellers/${id}/deactivate`),
};

export default apiClient;
