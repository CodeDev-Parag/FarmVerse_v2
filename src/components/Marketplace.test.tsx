import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Marketplace } from './Marketplace';

describe('Marketplace Component', () => {
    it('renders products with realistic images', () => {
        render(<Marketplace />);
        expect(screen.getByText('Organic Tomatoes')).toBeInTheDocument();
        // Since we removed placeholders, we now check for the specific crop images
        expect(screen.getByAltText(/Organic Tomatoes/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Fresh Apples/i)).toBeInTheDocument();
    });
});
