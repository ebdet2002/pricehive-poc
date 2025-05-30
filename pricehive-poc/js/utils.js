// Utility functions for PriceHive

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// Format package size
export const formatPackageSize = (quantity, unit, packaging) => {
    if (!quantity || !unit || !packaging) return '';
    return `${quantity} ${unit} ${packaging}`;
};

// Format date
export const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
};

// CSV handling
export const parseCSV = (csvText) => {
    if (!csvText) return [];
    
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
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
    if (!data || !data.length || !headers || !headers.length) return '';
    
    const headerRow = headers.map(h => h.label).join(',');
    const rows = data.map(item => 
        headers.map(h => {
            const value = item[h.key];
            return value !== null && value !== undefined ? value : '';
        }).join(',')
    );
    return [headerRow, ...rows].join('\n');
};

// Loading indicator
export const showLoading = (element, message = 'Loading...') => {
    if (!element) return;
    element.classList.add('loading');
    element.setAttribute('data-loading-text', message);
};

export const hideLoading = (element) => {
    if (!element) return;
    element.classList.remove('loading');
    element.removeAttribute('data-loading-text');
};

// Tooltip handling
export const createTooltip = (element, content) => {
    if (!element || !content) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = content;
    
    const showTooltip = () => {
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        
        // Position tooltip
        let top = rect.bottom + 5;
        let left = rect.left;
        
        // Adjust if tooltip would go off screen
        const tooltipRect = tooltip.getBoundingClientRect();
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = rect.top - tooltipRect.height - 5;
        }
        
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    };

    const hideTooltip = () => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    };

    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
    element.addEventListener('focus', showTooltip);
    element.addEventListener('blur', hideTooltip);

    // Cleanup function
    return () => {
        element.removeEventListener('mouseenter', showTooltip);
        element.removeEventListener('mouseleave', hideTooltip);
        element.removeEventListener('focus', showTooltip);
        element.removeEventListener('blur', hideTooltip);
        hideTooltip();
    };
};