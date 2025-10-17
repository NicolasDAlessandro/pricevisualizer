// Tipos para la comunicación con el backend

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
      token: string;
      user: UserDto;
  }
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "vendedor" | "gerente";
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: "admin" | "vendedor" | "gerente";
  firstName: string;
  lastName: string;
}

export interface ProductDto {
  id?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  stock_centro?: number;     
  stock_deposito?: number;  
  category?: string;
  sellerId?: string;
  sellerName?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CartItemDto {
  productId: string;
  quantity: number;
  product: ProductDto;
}

export interface PaymentDto {
  id: string;
  userId: string;
  amount: number;
  method: string;
  installments: number;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}


export interface BudgetItemDto {
    productoId: number;
    cantidad: number;
  }

export interface CreateBudgetDto {
  vendedorId: number;
  userId?: number; 
  payments: number[]; 
  items: {
    productoId: number;
    cantidad: number;
  }[];
}

export type SellerDto = {
  id: number;
  nombre: string;
  apellido: string;
  numero_vendedor: number;
  activo: boolean;
  createdAt: string;
};


// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      PROFILE: "/auth/profile",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh"
    },
    PRODUCTS: {
      LIST: "/products",
      DETAIL: (id: string) => `/products/${id}`,
      CREATE: "/products",
      UPDATE: (id: string) => `/products/${id}`,
      DELETE: (id: string) => `/products/${id}`,
      BY_SELLER: (sellerId: string) => `/products/seller/${sellerId}`,
      BULK: '/products/bulk',
    },
    CART: {
      GET: "/cart",
      ADD: "/cart/items",
      UPDATE: (itemId: string) => `/cart/items/${itemId}`,
      REMOVE: (itemId: string) => `/cart/items/${itemId}`,
      CLEAR: "/cart/clear"
    },
    PAYMENTS: {
      CREATE: "/payments",
      LIST: "/payments",
      DETAIL: (id: string) => `/payments/${id}`,
      UPDATE: (id: string) => `/payments/${id}`
    },
    BUDGETS: {
      CREATE: "/budgets",
      LIST: "/budgets",
      DETAIL: (id: string) => `/budgets/${id}`,
      SEND: (id: string) => `/budgets/${id}/send`,
      UPDATE: (id: string) => `/budgets/${id}`,  
      DELETE: (id: string) => `/budgets/${id}`,   
      ACCEPT: (id: string) => `/budgets/${id}/accept`,
      REJECT: (id: string) => `/budgets/${id}/reject`,
      STATS: "/budgets/stats",
    },
    USERS: {
      LIST: "/users",
      DETAIL: (id: string) => `/users/${id}`,
      UPDATE: (id: string) => `/users/${id}`,
      SELLERS: "/users/sellers"
    }
  }
};
