// Reusable table component with sorting and filtering
export class DataTable {
    constructor(containerId, columns, data = []) {
        this.container = document.getElementById(containerId);
        this.columns = columns;
        this.data = data;
        this.filteredData = [...data];
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        this.render();
        this.bindEvents();
    }

    render() {
        const tableHTML = `
            <div class="table-controls">
                <input type="text" id="table-filter" placeholder="Filter table..." class="filter-input">
                <div class="table-actions">
                    ${this.renderActions()}
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            ${this.columns.map(col => `
                                <th data-column="${col.key}" class="sortable">
                                    ${col.label}
                                    <span class="sort-indicator"></span>
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderRows()}
                    </tbody>
                </table>
            </div>
        `;
        
        this.container.innerHTML = tableHTML;
    }

    renderRows() {
        return this.filteredData.map(row => `
            <tr data-id="${row.id}" class="table-row">
                ${this.columns.map(col => `
                    <td>${this.formatCellValue(row[col.key], col)}</td>
                `).join('')}
            </tr>
        `).join('');
    }

    renderActions() {
        return ''; // Override this method to add custom actions
    }

    formatCellValue(value, column) {
        if (!value && value !== 0) return '';
        if (column.format) return column.format(value, this.data);
        return value;
    }

    bindEvents() {
        // Sort handling
        const headers = this.container.querySelectorAll('th.sortable');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sort(column);
            });
        });

        // Filter handling
        const filterInput = this.container.querySelector('#table-filter');
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                this.filter(e.target.value);
            });
        }
    }

    sort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredData.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];

            // Handle null values
            if (valueA === null) return 1;
            if (valueB === null) return -1;

            // Handle numbers
            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            }

            // Handle strings
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
            
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updateSortIndicators();
        this.render();
    }

    filter(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        this.filteredData = this.data.filter(row => {
            return this.columns.some(col => {
                const value = row[col.key];
                if (!value && value !== 0) return false;
                return String(value).toLowerCase().includes(searchTerm);
            });
        });
        this.render();
    }

    updateSortIndicators() {
        const headers = this.container.querySelectorAll('th.sortable');
        headers.forEach(header => {
            const indicator = header.querySelector('.sort-indicator');
            if (header.dataset.column === this.sortColumn) {
                indicator.textContent = this.sortDirection === 'asc' ? ' ↑' : ' ↓';
            } else {
                indicator.textContent = '';
            }
        });
    }

    // Public methods for external use
    addRow(row) {
        this.data.push(row);
        this.filteredData.push(row);
        this.render();
    }

    updateRow(id, updates) {
        const index = this.data.findIndex(row => row.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updates };
            this.filteredData = [...this.data];
            this.render();
        }
    }

    removeRow(id) {
        this.data = this.data.filter(row => row.id !== id);
        this.filteredData = this.filteredData.filter(row => row.id !== id);
        this.render();
    }

    refresh(newData) {
        this.data = newData;
        this.filteredData = [...newData];
        this.render();
    }
}