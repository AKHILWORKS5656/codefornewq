import { User, Review, Order, ShippingAddress, CartItem, Product, Category, OrderStatus } from './types';

const AWS_BASE_URL = 'https://api.beauzead.com/v1';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('beauzead_auth_token')}`
});

export const api = {
  getAnalytics: async () => {
    return { totalRevenue: 124500, totalOrders: 850, platformFees: 4350, totalCancellations: 12 };
  },

  getSellerStats: async (sellerId: string) => {
    return {
      monthlySales: 12450,
      activeProducts: 24,
      pendingOrders: 5,
      totalEarnings: 84200,
      rating: 4.8
    };
  },

  subscribeToStockUpdates: (productId: string, callback: (stock: number) => void) => {
    console.log(`Establishing real-time connection for PID: ${productId}`);
    return () => console.log(`Connection terminated for PID: ${productId}`);
  },

  getCategories: async (): Promise<Category[]> => {
    return [
      { id: '1', name: 'Fashion', subCategories: ['Menswear', 'Womenswear'] },
      { id: '2', name: 'Electronics', subCategories: ['Smartphones', 'Audio'] },
      { id: '3', name: 'Beauty', subCategories: ['Skincare', 'Fragrance'] },
    ];
  },

  addCategory: async (name: string): Promise<Category> => {
    return { id: Math.random().toString(), name, subCategories: [] };
  },

  deleteCategory: async (id: string): Promise<void> => {
    console.log('Category deleted');
  },

  getProducts: async (filters?: { category?: string; search?: string; sellerId?: string }): Promise<Product[]> => {
    // Return empty or mock products if needed
    return [];
  },

  getSellerProducts: async (sellerId: string): Promise<Product[]> => {
    return []; // In a real app, filter PRODUCTS by sellerId
  },

  addProduct: async (data: any): Promise<Product> => {
    return { ...data, id: 'p-' + Date.now(), createdAt: new Date().toISOString(), isActive: true, rating: 5, reviews: 0, seller: 'Beauzead Partner', sellerId: 's-1' };
  },

  updateProduct: async (id: string, data: any): Promise<Product> => {
    return { id, ...data };
  },

  deleteProduct: async (id: string): Promise<void> => {
    console.log(`Product ${id} removed`);
  },

  getProductById: async (id: string): Promise<Product> => {
    throw new Error("Product metadata unavailable");
  },

  getReviews: async (productId?: string): Promise<Review[]> => {
    return [];
  },

  updateReview: async (id: string, data: Partial<Review>): Promise<Review> => {
    return { id, ...data } as any;
  },

  deleteReview: async (id: string): Promise<void> => {},

  addReview: async (review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    return { ...review, id: 'r-' + Date.now(), createdAt: new Date().toISOString() };
  },

  login: async (email: string, password: string): Promise<User> => {
    const lowerEmail = email.toLowerCase();
    
    if ((lowerEmail === 'seller@seller.com' || lowerEmail === 'seller@sellser.com') && password === 'seller@123') {
      const user: User = { 
        id: 's-123', email: 'seller@seller.com', name: 'Beauzead Partner', role: 'seller', 
        country: 'United Kingdom', currency: 'GBP', currencySymbol: '£', status: 'active', createdAt: new Date().toISOString() 
      };
      localStorage.setItem('beauzead_auth_token', 'mock-token-seller');
      localStorage.setItem('beauzead_current_user', JSON.stringify(user));
      return user;
    }

    if (lowerEmail === 'admin@admin.com' && password === 'admin@123') {
      const user: User = { 
        id: 'a-1', email: 'admin@admin.com', name: 'Beauzead Admin', role: 'admin', 
        country: 'United Kingdom', currency: 'GBP', currencySymbol: '£', status: 'active', createdAt: new Date().toISOString() 
      };
      localStorage.setItem('beauzead_auth_token', 'mock-token-admin');
      localStorage.setItem('beauzead_current_user', JSON.stringify(user));
      return user;
    }

    if (lowerEmail === 'user@user.com' && password === 'user@123') {
      const user: User = { 
        id: 'u-1', email: 'user@user.com', name: 'Demo User', role: 'user', 
        country: 'United Kingdom', currency: 'GBP', currencySymbol: '£', status: 'active', createdAt: new Date().toISOString() 
      };
      localStorage.setItem('beauzead_auth_token', 'mock-token-user');
      localStorage.setItem('beauzead_current_user', JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid credentials or account restricted');
  },

  verifyOtp: async (email: string, code: string): Promise<void> => {},

  getUsers: async (): Promise<User[]> => { return []; },

  updateUserStatus: async (userId: string, status: 'active' | 'banned'): Promise<void> => {},

  deleteUser: async (userId: string): Promise<void> => {},

  getSellers: async () => { return []; },

  deleteSeller: async (id: string): Promise<void> => {},

  updateSellerStatus: async (sellerId: string, status: 'active' | 'banned'): Promise<void> => {},

  getOrders: async (): Promise<Order[]> => { return []; },

  getSellerOrders: async (sellerId: string): Promise<Order[]> => { return []; },

  getShippingOrders: async (): Promise<any[]> => { return []; },

  createOrder: async (orderData: any): Promise<Order> => { throw new Error('Simulated fail'); },

  getCancellations: async (): Promise<any[]> => { return []; },

  getAccountRequests: async (): Promise<any[]> => { return []; },

  getListingRequests: async (): Promise<any[]> => { return []; },

  getSellersBusiness: async (): Promise<any[]> => { return []; },

  getTransactions: async (): Promise<any[]> => { return []; },

  getSellerEarnings: async (sellerId: string): Promise<any[]> => { return []; },

  getCart: async (): Promise<CartItem[]> => {
    const localCart = localStorage.getItem('beauzead_cart');
    return localCart ? JSON.parse(localCart) : [];
  },

  addToCart: async (product: Product, quantity: number): Promise<CartItem[]> => {
    const items = await api.getCart();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ ...product, cartId: Math.random().toString(36).substr(2, 9), quantity, addedAt: Date.now() });
    }
    localStorage.setItem('beauzead_cart', JSON.stringify(items));
    return items;
  },

  removeFromCart: async (cartId: string): Promise<CartItem[]> => {
    let items = await api.getCart();
    items = items.filter(i => i.cartId !== cartId);
    localStorage.setItem('beauzead_cart', JSON.stringify(items));
    return items;
  },

  updateCartQuantity: async (cartId: string, delta: number): Promise<CartItem[]> => {
    let items = await api.getCart();
    const index = items.findIndex(i => i.cartId === cartId);
    if (index !== -1) {
      items[index].quantity = Math.max(1, items[index].quantity + delta);
    }
    localStorage.setItem('beauzead_cart', JSON.stringify(items));
    return items;
  },

  addSubCategory: async (catId: string, subName: string): Promise<void> => {},

  deleteSubCategory: async (catId: string, subName: string): Promise<void> => {},

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {},

  checkEmailExists: async (email: string) => { return false; },

  updateUserProfile: async (id: string, data: any) => { return data; },

  saveShippingAddress: async (id: string, addr: any) => {},

  updatePassword: async (email: string, password: string) => {},

  getUserOrders: async (userId: string): Promise<Order[]> => { return []; },
};