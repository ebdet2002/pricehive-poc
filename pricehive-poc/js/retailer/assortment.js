import { DataTable } from '../components/table.js';
import { DatabaseService } from '../database.js';
import { formatCurrency, formatPackageSize, formatDate } from '../utils.js';

export async function init(pageElement) {
    const columns = [
        { key: 'product_name', label: 'Product',
          format: (_, row) => row.product.name },
        { key: 'manufacturer', label: 'Manufacturer',
          format: (_, row) => row.manufacturer?.name || 'N/A' },
        { key: 'package_info', label: 'Package',
          format: (_, row) => formatPackageSize(
              row.product.package_size_quantity,
              row.product.package_size_unit,
              row.product.package_size_packaging
          )
        },
        { key: 'sku', label: 'SKU' },
        { key: 'unit_cost', label: 'Unit Cost',
          format: (value) => formatCurrency(value) },
        { key: 'status', label: 'Status',
          format: (value) => `<span class="status-badge status-${value.toLowerCase()}">${value}</span>` },
        { key: 'effective_date', label: 'Effective Date',
          format: (value) => value ? formatDate(value) : 'Not Set' }
    ];

    // Create page structure
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="page-header">
            <h1>Product Assortment</h1>
        </div>
        <div id="assortment-table"></div>
    `;
    pageElement.innerHTML = '';
    pageElement.appendChild(container);

    try {
        // Fetch product assignments
        const assignments = await DatabaseService.getProductAssignments();
        const table = new DataTable('assortment-table', columns, assignments);

        // Add click handler for rows
        document.getElementById('assortment-table').addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (row) {
                const id = row.dataset.id;
                const assignment = assignments.find(a => a.id === id);
                if (assignment) {
                    showProductDetails(assignment);
                }
            }
        });

    } catch (error) {
        console.error('Failed to load assortment:', error);
        window.toast.error('Failed to load assortment');
    }

    function showProductDetails(assignment) {
        window.modal.create({
            title: assignment.product.name,
            content: `
                <div class="product-details">
                    <div class="detail-section">
                        <h3>Product Information</h3>
                        <p><strong>Brand:</strong> ${assignment.product.brand}</p>
                        <p><strong>UPC:</strong> ${assignment.product.upc}</p>
                        <p><strong>Package:</strong> ${formatPackageSize(
                            assignment.product.package_size_quantity,
                            assignment.product.package_size_unit,
                            assignment.product.package_size_packaging
                        )}</p>
                        <p><strong>Case Quantity:</strong> ${assignment.product.case_quantity}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Pricing Information</h3>
                        <p><strong>Unit Cost:</strong> ${formatCurrency(assignment.unit_cost)}</p>
                        <p><strong>Default Price:</strong> ${formatCurrency(assignment.product.default_price)}</p>
                    </div>

                    <div class="detail-section">
                        <h3>Status Information</h3>
                        <p><strong>Status:</strong> ${assignment.status}</p>
                        <p><strong>Effective Date:</strong> ${assignment.effective_date ? formatDate(assignment.effective_date) : 'Not Set'}</p>
                        <p><strong>SKU:</strong> ${assignment.sku || 'Not Set'}</p>
                    </div>

                    <div class="detail-section">
                        <h3>Manufacturer Information</h3>
                        <p><strong>Name:</strong> ${assignment.manufacturer.name}</p>
                    </div>
                </div>
            `
        });
    }
}