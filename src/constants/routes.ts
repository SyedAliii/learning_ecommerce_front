export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  PRODUCT_DETAIL: '/:categorySlug/:subCategorySlug/:title/:productId',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_CONFIRMATION: '/order/:orderId/confirmation',
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_ORDERS: '/profile/orders',
  PROFILE_SETTINGS: '/profile/settings',
  
  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: '/admin/products/:categorySlug/:subCategorySlug/:title/:productId/edit',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: '/admin/orders/:orderId',
} as const;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
