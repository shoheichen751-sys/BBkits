/**
 * Brazilian Currency Formatting Utilities
 * 
 * These functions handle Brazilian Real (BRL) currency formatting
 * with proper Brazilian localization (comma as decimal separator, period as thousands separator)
 */

/**
 * Format a number as Brazilian currency
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted currency string (e.g., "R$ 1.234,56")
 */
export const formatBRL = (value) => {
    try {
        if (value === null || value === undefined || value === '') {
            return 'R$ 0,00';
        }
        
        const number = parseFloat(value);
        if (isNaN(number)) {
            return 'R$ 0,00';
        }
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    } catch (error) {
        console.error('Error formatting Brazilian currency:', error);
        return 'R$ 0,00';
    }
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use formatBRL instead
 */
export const formatCurrency = (amount) => {
    return formatBRL(amount);
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use formatBRL instead
 */
export const formatCurrencyWithSymbol = (amount) => {
    return formatBRL(amount);
};

/**
 * Format a number as Brazilian currency without the R$ symbol
 * @param {number|string} value - The value to format
 * @returns {string} - Formatted currency string without symbol (e.g., "1.234,56")
 */
export const formatBRLNumber = (value) => {
    try {
        if (value === null || value === undefined || value === '') {
            return '0,00';
        }
        
        const number = parseFloat(value);
        if (isNaN(number)) {
            return '0,00';
        }
        
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } catch (error) {
        console.error('Error formatting Brazilian currency number:', error);
        return '0,00';
    }
};

/**
 * Format input value for Brazilian currency input fields
 * Used for real-time input formatting as user types
 * @param {string} value - The raw input value
 * @returns {string} - Formatted value for input display
 */
export const formatBrazilianCurrencyInput = (value) => {
    try {
        if (!value || value === '') return '';
        
        // Remove all non-digits first
        const cleaned = value.replace(/[^\d]/g, '');
        if (!cleaned) return '0,00';
        
        // Convert to number and divide by 100 to handle cents
        const number = parseFloat(cleaned) / 100;
        if (isNaN(number)) return '0,00';
        
        // Format with comma as decimal separator
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } catch (error) {
        console.error('Error formatting Brazilian currency input:', error);
        return '0,00';
    }
};

/**
 * Parse Brazilian currency input back to a number
 * Used to convert formatted input back to numeric value for storage
 * @param {string} value - The formatted Brazilian currency string
 * @returns {string} - Numeric string value for backend storage
 */
export const parseBrazilianCurrency = (value) => {
    try {
        if (!value || value === '') return '0';
        
        // Remove currency symbol and spaces
        let cleaned = value.replace(/[R$\s]/g, '');
        
        // Replace comma with period for decimal separator
        cleaned = cleaned.replace(',', '.');
        
        // Remove all periods except the last one (which should be decimal)
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            // Join all parts except last with nothing, then add decimal part
            cleaned = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
        }
        
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? '0' : parsed.toString();
    } catch (error) {
        console.error('Error parsing Brazilian currency:', error);
        return '0';
    }
};

/**
 * Format additional cost for display in forms (e.g., embroidery costs)
 * @param {number|string} cost - The additional cost value
 * @returns {string} - Formatted cost string (e.g., "+R$ 15,00" or empty if 0)
 */
export const formatAdditionalCost = (cost) => {
    const numericCost = parseFloat(cost);
    if (isNaN(numericCost) || numericCost <= 0) {
        return '';
    }
    return ` (+${formatBRL(numericCost)})`;
};