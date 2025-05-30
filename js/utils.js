// Utility functions for PriceHive

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Format package size
export const formatPackageSize = (quantity, unit, packaging) => {
    return `${quantity} ${unit} ${packaging}`;
};

// Format date
export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
};

// CSV handling
export const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
        }, {});
    });
};

export const generateCSV = (data, headers) => {
    const headerRow = headers.map(h => h.label).join(',');
    const rows = data.map(item => 
        headers.map(h => item[h.key]).join(',')
    );
    return [headerRow, ...rows].join('\n');
};

// Loading indicator
export const showLoading = (element, message = 'Loading...') => {
    element.classList.add('loading');
    element.setAttribute('data-loading-text', message);
};

export const hideLoading = (element) => {
    element.classList.remove('loading');
    element.removeAttribute('data-loading-text');
};

// Tooltip handling
export const createTooltip = (element, content) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = content;
    
    element.addEventListener('mouseenter', () => {
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 5}px`;
        tooltip.style.left = `${rect.left}px`;
    });

    element.addEventListener('mouseleave', () => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    });
};