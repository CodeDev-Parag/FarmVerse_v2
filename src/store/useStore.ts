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
            products: [],
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
                        products: [...state.products.filter(p => !p._id), ...res.data]
                    }));
                } catch (error) {
                    console.warn('Backend unavailable. Operating with local or cached products.');
                }
            }
        }),
        {
            name: 'farmverse-feature-storage',
            partialize: (state) => ({ cart: state.cart, user: state.user, isAuthenticated: state.isAuthenticated, products: state.products, orders: state.orders }),
        }
    )
);
