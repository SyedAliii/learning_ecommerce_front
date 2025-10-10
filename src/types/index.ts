export type UserRole = 'admin' | 'user';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  category_id: string;
  subcategory_id: string;
  product_img_urls: string[];
  url_slug?: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  items: CartProduct[];
  status_code: number;
  msg: string;
}

export interface Order {
  id: string;
  user_id: string;
  user: {
    full_name: string;
    email: string;
  };
  items: CartProduct[];
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_method: string;
  shipping: ShippingInfo;
  created_at: string;
}

export interface CartProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  total_quantity: number;
  cateogry_id: string;
  subcategory_id: string;
  qunatity_in_cart: number;
}

export interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  category_id: string;
}
