import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Transfer from './page';

describe('Transfer component', () => {
    test('Submitting the form', async () => {
        const { getByLabelText, getByText } = render(<Transfer />);

        // Fill in form fields
        fireEvent.change(getByLabelText('Amount'), { target: { value: '50' } });
        fireEvent.change(getByLabelText('Purpose'), { target: { value: 'Test purpose' } });
        fireEvent.change(getByLabelText('Payee Account'), { target: { value: 'Test payee account' } });
        fireEvent.change(getByLabelText('Payee'), { target: { value: 'Test payee' } });

        // Submit form
        fireEvent.click(getByText('Submit'));

        // Wait for async validation if any
        await waitFor(() => {
            // Assert on expected behavior after submitting the form
            // For example, you can check if a success message is displayed
        });
    });
});