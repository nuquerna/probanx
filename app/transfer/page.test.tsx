import React from 'react';
import { render } from '@testing-library/react';
import Transfer from './page';
import { LanguageContext } from '../context/languageContext';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});


jest.mock('../actions', () => ({
    validateIban: jest.fn().mockResolvedValue(undefined)
}));

describe('Transfer component', () => {
    it('renders transfer form correctly', () => {
        const { getByLabelText, getByText } = render(
            <LanguageContext.Provider value="en">
                <Transfer />
            </LanguageContext.Provider>
        );

        expect(getByLabelText('Amount')).toBeDefined();
        expect(getByLabelText('Purpose')).toBeDefined();
        expect(getByLabelText('Payee Account')).toBeDefined();
        expect(getByLabelText('Payee')).toBeDefined();
        expect(getByText('Submit')).toBeDefined();
    });
});