export interface Product {
  id: string; // productId
  title: string; // name
  description: string;
  importantNote?: string;
  categoryId: string;
  sellerId: string;
  seller: string; // seller name
  price: number;
  originalPrice?: number; // oldPrice
  stock: number;
  image: string; // primary image
  images: string[]; // array of 5 images
  rating: number;
  reviews: number; // reviewCount
  isActive: boolean;
  category: string;
  createdAt: string;
  variantInfo?: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories: string[];
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  addedAt: number;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export type UserRole = 'admin' | 'user' | 'seller';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  country: string;
  currency: string;
  currencySymbol: string;
  status: 'active' | 'banned';
  createdAt: string;
  address?: ShippingAddress;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'banned';
}

export interface LedgerEntry {
  id: string;
  type: 'INCOME' | 'OUTGOING';
  cat: string;
  amount: string;
  status: string;
  time: string;
}

export interface Country {
  name: string;
  code: string;
  currency: string;
  symbol: string;
  phonePrefix: string;
  phoneLength: number;
  postcodeRegex: RegExp;
  shippingFee: number;
  conversionRate: number;
}

export interface Review {
  id: string; // reviewId
  productId: string;
  productName?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string; // timestamp
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  postcode: string;
  country: string;
}

export type OrderStatus = 'PENDING' | 'APPROVED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'NOT_PLACED' | 'RETURN_REQUESTED' | 'PROCESSING';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  orderId: string;
  productId: string;
  sellerId?: string;
  productName: string;
  productImage: string;
  variantInfo?: string;
  sharingInfo?: string;
  statusMessage?: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  deliveryCharge: number;
  platformFee: number;
  totalPaid: number;
  currencySymbol: string;
  address: ShippingAddress;
  paymentStatus: 'pending' | 'success' | 'failed';
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  createdAt: string; // Booking Date
  deliveryDate?: string; // Actual or expected delivery date
  cancelledDate?: string;
}

export type AuthView = 
  | 'home' 
  | 'login' 
  | 'signup' 
  | 'signup_otp' 
  | 'forget_password' 
  | 'forget_password_otp' 
  | 'new_password' 
  | 'admin_dashboard'
  | 'product_details'
  | 'reviews_page'
  | 'checkout_cart'
  | 'checkout_order'
  | 'checkout_shipping'
  | 'checkout_payment'
  | 'checkout_summary'
  | 'user_profile'
  | 'my_orders'
  | 'terms_and_conditions'
  | 'privacy_policy'
  | 'refund_policy'
  | 'shipping_policy'
  | 'admin_list_products'
  | 'sellers_landing'
  | 'sellers_login'
  | 'sellers_forgot_password'
  | 'sellers_signup';