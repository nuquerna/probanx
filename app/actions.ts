'use server'

const IBAN_VALIDATION = 'https://matavi.eu/validate?iban=';

export async function validateIban(value: string) {
    try {
        const response = await fetch(`${IBAN_VALIDATION}${value}`);
        const data = await response.json();
        if (!data.valid) {
            return 'Invalid IBAN';
        }
    } catch (error) {
        return 'Error validating IBAN';
    }
    return undefined;
}