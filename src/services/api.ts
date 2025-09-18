import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../types/Api';
import type { LoginResponse, ApiResponse, ProductDto} from '../types/Api';
import type { BulkUploadResponse } from '../types/BulkUploadResponse';
import type { PaymentDto } from '../types/Api';
import type { SellerDto } from '../types/Api';
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
  (error) => {
    return Promise.reject(error);
  }
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
    try {
      const response = await apiRequest<LoginResponse>('POST', API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      console.log("Respuesta de login:", response); 
      return response;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
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

  refreshToken: async () => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.REFRESH);
  },

  logout: async () => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  },
};

export const productService = {
  getAll: async (params?: any) => {
    const respRaw = await apiRequest<any>(
      'GET',
      API_CONFIG.ENDPOINTS.PRODUCTS.LIST,
      undefined,
      { params }
    );

    // Si respRaw ya es objeto, lo usamos directo
    let parsed: any;
    if (typeof respRaw === "string") {
      try {
        // Elimina cualquier texto antes del JSON válido
        const jsonStart = respRaw.indexOf("{");
        const clean = respRaw.slice(jsonStart);
        parsed = JSON.parse(clean);
      } catch (err) {
        console.error("Error parseando respuesta:", err);
        return [];
      }
    } else {
      parsed = respRaw;
    }

    const products = Array.isArray(parsed.data) ? parsed.data : [];

    return products.map((p: any) => ({
      id: Number(p.id),
      name: p.name,
      description: p.description,
      price: Number(p.price),
      stock: Number(p.stock),
      stock_centro: Number(p.stock_centro ?? 0),   
      stock_deposito: Number(p.stock_deposito ?? 0), 
      category: p.category,
      imageUrl: p.image_url,
      sellerId: p.seller_id,
      sellerName: p.seller_name,
      updatedAt: p.updated_at,
    }));
  },



  getById: async (id: string) => {
    return apiRequest<ProductDto>('GET', API_CONFIG.ENDPOINTS.PRODUCTS.DETAIL(id));
  },

  create: async (product: ProductDto) => {
    return apiRequest<ProductDto>('POST', API_CONFIG.ENDPOINTS.PRODUCTS.CREATE, product);
  },

  update: async (id: string, product: ProductDto) => {
    return apiRequest<ProductDto>('PUT', API_CONFIG.ENDPOINTS.PRODUCTS.UPDATE(id), product);
  },

  delete: async (id: string) => {
    return apiRequest('DELETE', API_CONFIG.ENDPOINTS.PRODUCTS.DELETE(id));
  },

  getBySeller: async (sellerId: string) => {
    return apiRequest<ApiResponse<ProductDto[]>>('GET', API_CONFIG.ENDPOINTS.PRODUCTS.BY_SELLER(sellerId));
  },

  bulkUpload: async (products: ProductDto[]): Promise<BulkUploadResponse> => {
    return apiRequest<BulkUploadResponse>('POST', API_CONFIG.ENDPOINTS.PRODUCTS.BULK, { products });
  },
};

export const cartService = {
  getCart: async () => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.CART.GET);
  },

  addItem: async (productId: string, quantity: number) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.CART.ADD, { productId, quantity });
  },

  updateItem: async (itemId: string, quantity: number) => {
    return apiRequest('PUT', API_CONFIG.ENDPOINTS.CART.UPDATE(itemId), { quantity });
  },

  removeItem: async (itemId: string) => {
    return apiRequest('DELETE', API_CONFIG.ENDPOINTS.CART.REMOVE(itemId));
  },

  clearCart: async () => {
    return apiRequest('DELETE', API_CONFIG.ENDPOINTS.CART.CLEAR);
  },
};

export const paymentService = {
  createPayment: async (paymentData: any) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.PAYMENTS.CREATE, paymentData);
  },

  getPayments: async (params?: { page?: number; pageSize?: number }) => {
  const respRaw = await apiRequest<any>(
    'GET',
    API_CONFIG.ENDPOINTS.PAYMENTS.LIST,
    undefined,
    { params }
  );

  // Si respRaw ya es objeto, lo usamos directo
  let parsed: any;
  if (typeof respRaw === "string") {
    try {
      // Elimina cualquier texto antes del JSON válido
      const jsonStart = respRaw.indexOf("{");
      const clean = respRaw.slice(jsonStart);
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("Error parseando respuesta de pagos:", err);
      return [];
    }
  } else {
    parsed = respRaw;
  }

  const payments = Array.isArray(parsed.data) ? parsed.data : [];

  return payments.map((p: any): PaymentDto => ({
    id: String(p.id),
    userId: String(p.user_id),
    amount: Number(p.amount),
    method: p.method,
    installments: Number(p.installments),
    description: p.description,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
},



  getPayment: async (id: string) => {
    const p = await apiRequest<any>('GET', API_CONFIG.ENDPOINTS.PAYMENTS.DETAIL(id));
    return {
      id: String(p.id),
      userId: p.user_id,
      amount: Number(p.amount),
      method: p.method,
      installments: Number(p.installments),
      description: p.description,
      status: p.status,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  },

  updatePayment: async (id: string, data: Partial<PaymentDto>) => {
    return apiRequest('PUT', API_CONFIG.ENDPOINTS.PAYMENTS.UPDATE(id), data);
  },

};


export const budgetService = {
  createBudget: async (budgetData: any) => {
    return apiRequest('POST', API_CONFIG.ENDPOINTS.BUDGETS.CREATE, budgetData);
  },

  getBudgets: async (filters?: { vendedor?: string; dateFrom?: string; dateTo?: string; rubro?: string }) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.BUDGETS.LIST, undefined, { params: filters });
  },

  getBudget: async (id: string) => {
    return apiRequest('GET', API_CONFIG.ENDPOINTS.BUDGETS.DETAIL(id));
  },

  updateBudget: async (id: string, data: any) => {
    return apiRequest('PUT', API_CONFIG.ENDPOINTS.BUDGETS.UPDATE(id), data);
  },

  deleteBudget: async (id: string) => {
    return apiRequest('DELETE', API_CONFIG.ENDPOINTS.BUDGETS.DELETE(id));
  }
};

export const sellerService = {
  getAll: async (all = false): Promise<SellerDto[]> => {
    const respRaw = await apiRequest<any>(
      "GET",
      all ? "/sellers?all=1" : "/sellers"
    );

    let parsed: any;
    if (typeof respRaw === "string") {
      try {
        const jsonStart = respRaw.indexOf("{");
        const clean = respRaw.slice(jsonStart);
        parsed = JSON.parse(clean);
      } catch (err) {
        console.error("Error parseando respuesta de sellers:", err);
        return [];
      }
    } else {
      parsed = respRaw;
    }

    const sellers = Array.isArray(parsed.data) ? parsed.data : [];

    return sellers.map((s: any): SellerDto => ({
      id: Number(s.id),
      nombre: s.nombre,
      apellido: s.apellido,
      numeroVendedor: Number(s.numero_vendedor),
      activo: Boolean(s.activo),
      createdAt: s.created_at,
    }));
  },

  create: async (seller: {
    nombre: string;
    apellido: string;
    numeroVendedor: number;
  }) => {
    return apiRequest("POST", "/sellers", seller);
  },

  activate: async (id: number) => {
    return apiRequest("PATCH", `/sellers/${id}/activate`);
  },

  deactivate: async (id: number) => {
    return apiRequest("PATCH", `/sellers/${id}/deactivate`);
  },
};



export default apiClient;

