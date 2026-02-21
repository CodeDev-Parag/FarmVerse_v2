import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export interface Product {
    _id: string;
    id?: string;
    name: string;
    price: number;
    farmer?: string;
    image?: string;
    category?: string;
    subCategory?: string;
}

export interface User {
    email: string;
    role: 'farmer' | 'consumer';
    name?: string;
}

export interface OrderItem {
    name: string;
    price: number;
    image?: string;
}

export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
    date: string;
    customerName: string;
    address: string;
    city: string;
    paymentMethod: string;
}

interface AppState {
    cart: Product[];
    products: Product[];
    orders: Order[];
    isCartOpen: boolean;
    user: User | null;
    isAuthenticated: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    removeOneFromCart: (productId: string) => void;
    toggleCart: () => void;
    fetchProducts: () => Promise<void>;
    clearCart: () => void;
    login: (email: string, role: 'farmer' | 'consumer') => void;
    logout: () => void;
    addProductLocally: (product: Product) => void;
    placeOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            cart: [],
            products: [
                { _id: 'mock-1', name: 'Organic Tomatoes', price: 40, farmer: 'Ramesh Kumar', category: 'vegetable', subCategory: 'tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80' },
                { _id: 'mock-2', name: 'Premium Basmati Rice', price: 120, farmer: 'Singh Farms', category: 'grain', subCategory: 'rice', image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=500&q=80' },
                { _id: 'mock-3', name: 'Fresh Potatoes', price: 25, farmer: 'Green Valley Naturals', category: 'vegetable', subCategory: 'potato', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80' },
                { _id: 'mock-4', name: 'Alphonso Mangoes', price: 400, farmer: 'AgriCorp Orchards', category: 'fruit', subCategory: 'mango', image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500&q=80' },
                { _id: 'mock-5', name: 'Red Onions', price: 35, farmer: 'Ramesh Kumar', category: 'vegetable', subCategory: 'onion', image: '/red_onions.png' },
                { _id: 'mock-6', name: 'Farm Fresh Milk', price: 60, farmer: 'Surya Dairy', category: 'dairy', subCategory: 'milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80' },
                { _id: 'mock-7', name: 'Fresh Spinach', price: 30, farmer: 'Organic Village', category: 'vegetable', subCategory: 'spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80' },
                { _id: 'mock-8', name: 'Organic Wheat', price: 45, farmer: 'Singh Farms', category: 'grain', subCategory: 'wheat', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80' }
            ],
            orders: [],
            isCartOpen: false,
            user: null,
            isAuthenticated: false,
            addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => (item._id || item.id) !== productId)
            })),
            removeOneFromCart: (productId) => set((state) => {
                const index = state.cart.findIndex(item => (item._id || item.id) === productId);
                if (index === -1) return state;
                const newCart = [...state.cart];
                newCart.splice(index, 1);
                return { cart: newCart };
            }),
            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
            clearCart: () => set({ cart: [] }),
            login: (email, role) => set({ user: { email, role }, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
            addProductLocally: (product) => set((state) => ({ products: [product, ...state.products] })),
            placeOrder: (orderData) => set((state) => ({
                orders: [{
                    ...orderData,
                    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
                    date: new Date().toISOString(),
                    status: 'confirmed',
                }, ...state.orders],
            })),
            fetchProducts: async () => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const res = await axios.get(`${apiUrl}/api/products`);
                    set((state) => ({
                        products: [...state.products.filter(p => !p._id || p._id.startsWith('mock-')), ...res.data]
                    }));
                } catch (error) {
                    console.warn('Backend unavailable. Operating with local or cached products.');
                }
            }
        }),
        {
            name: 'farmverse-store-v3',
            partialize: (state) => ({ cart: state.cart, user: state.user, isAuthenticated: state.isAuthenticated, products: state.products, orders: state.orders }),
        }
    )
);
