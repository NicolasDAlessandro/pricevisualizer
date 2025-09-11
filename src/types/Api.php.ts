// Tipos actualizados para la comunicación con el backend PHP

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
  token: string;
  user: UserDto;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface ProductDto {
  id?: string; 
  name: string;
  description?: string; 
  price: number;
  stock: number;
  stock_centro?: number;
  category?: string;
  imageUrl?: string;
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
  id?: string;
  productId: string;
  quantity: number;
  product: ProductDto;
}

export interface PaymentDto {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetDto {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  items: CartItemDto[];
  createdAt: string;
  updatedAt: string;
}

// Configuración de la API - OPTIMIZADA PARA PHP
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
      BY_SELLER: (sellerId: string) => `/products/seller/${sellerId}`
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
      ACCEPT: (id: string) => `/budgets/${id}/accept`,
      REJECT: (id: string) => `/budgets/${id}/reject`
    },
    USERS: {
      LIST: "/users",
      DETAIL: (id: string) => `/users/${id}`,
      SELLERS: "/users/sellers"
    }
  }
};
