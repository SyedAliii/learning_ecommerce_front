export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sub_category: string;
  image_urls: string[];
  slug?: string;
  category_slug?: string;
  sub_category_slug?: string;
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
  email: string;
  full_name: string;
  role: 'customer' | 'shop_owner';
}

export interface Order {
  id: string;
  user_id: string;
  user: {
    full_name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_method: string;
  shipping: ShippingInfo;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
  subtotal: number;
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
