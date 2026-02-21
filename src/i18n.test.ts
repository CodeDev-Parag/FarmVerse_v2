import { describe, it, expect } from 'vitest';
import i18n from './i18n';

describe('i18n Configuration', () => {
    it('loads English translation correctly', () => {
        expect(i18n.t('hero.title')).toBe('From Field to Table');
    });
    it('loads Hindi translation correctly', async () => {
        await i18n.changeLanguage('hi');
        expect(i18n.t('hero.title')).toBe('सीधा खेत से टेबल तक');
    });
});
