import { describe, it, expect } from 'vitest';
import { useStore } from './useStore';

describe('Zustand Store', () => {
    it('adds an item to cart', () => {
        useStore.getState().addToCart({ id: '1', name: 'Tomato', price: 40 });
        expect(useStore.getState().cart.length).toBe(1);
        expect(useStore.getState().cart[0].name).toBe('Tomato');
    });
});
