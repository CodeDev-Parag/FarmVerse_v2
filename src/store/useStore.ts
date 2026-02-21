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
    phone: string;
    role: 'farmer' | 'consumer';
    name?: string;
}

interface AppState {
    cart: Product[];
    products: Product[];
    isCartOpen: boolean;
    user: User | null;
    isAuthenticated: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    toggleCart: () => void;
    fetchProducts: () => Promise<void>;
    clearCart: () => void;
    login: (phone: string, role: 'farmer' | 'consumer') => void;
    logout: () => void;
    addProductLocally: (product: Product) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            cart: [],
            products: [],
            isCartOpen: false,
            user: null,
            isAuthenticated: false,
            addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => (item._id || item.id) !== productId)
            })),
            toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
            clearCart: () => set({ cart: [] }),
            login: (phone, role) => set({ user: { phone, role }, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
            addProductLocally: (product) => set((state) => ({ products: [product, ...state.products] })), // push local item into local inventory correctly
            fetchProducts: async () => {
                try {
                    // Try to fetch from backend, fallback locally gracefully if we want simple testing
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    const res = await axios.get(`${apiUrl}/api/products`);

                    // Merge local offline products conceptually if keeping it simple
                    set((state) => ({
                        products: [...state.products.filter(p => !p._id), ...res.data]
                    }));
                } catch (error) {
                    console.warn('Backend unavailable. Operating with local or cached products.');
                }
            }
        }),
        {
            name: 'farmverse-feature-storage', // unique name for local storage key
            // Now persist `products` alongside user details to make farmer feature testing work fully offline!
            partialize: (state) => ({ cart: state.cart, user: state.user, isAuthenticated: state.isAuthenticated, products: state.products }),
        }
    )
);
