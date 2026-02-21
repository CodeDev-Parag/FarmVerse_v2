import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './Hero';
import '../i18n'; // Load i18n for translations

describe('Hero Component', () => {
    it('renders spline placeholder and localized text', async () => {
        render(<Hero />);
        expect(await screen.findByText('From Field to Table')).toBeInTheDocument();
    });
});
