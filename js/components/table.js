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

    // Additional methods for sorting, filtering, etc.
}