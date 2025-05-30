import { DataTable } from '../components/table.js';
import { DatabaseService } from '../database.js';
import { formatCurrency, formatDate } from '../utils.js';

export async function init(pageElement) {
    const columns = [
        { key: 'retailer_name', label: 'Retailer', 
          format: (_, row) => row.retailer.name },
        { key: 'product_name', label: 'Product', 
          format: (_, row) => row.product.name },
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
            <h1>Retailer Management</h1>
            <button class="btn btn-primary" id="assign-product">Assign Product</button>
        </div>
        <div id="assignments-table"></div>
    `;
    pageElement.innerHTML = '';
    pageElement.appendChild(container);

    try {
        // Fetch product assignments
        const assignments = await DatabaseService.getProductAssignments();
        const table = new DataTable('assignments-table', columns, assignments);

        // Handle new assignment
        document.getElementById('assign-product').addEventListener('click', async () => {
            // Fetch retailers and products for the form
            const [retailers, products] = await Promise.all([
                DatabaseService.getOrganizations('retailer'),
                DatabaseService.getProducts()
            ]);

            window.modal.create({
                title: 'Assign Product to Retailer',
                content: `
                    <form id="assignment-form">
                        <div class="form-group">
                            <label for="retailer_id">Retailer</label>
                            <select id="retailer_id" required>
                                <option value="">Select Retailer</option>
                                ${retailers.map(r => `
                                    <option value="${r.id}">${r.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="product_id">Product</label>
                            <select id="product_id" required>
                                <option value="">Select Product</option>
                                ${products.map(p => `
                                    <option value="${p.id}">${p.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="sku">SKU</label>
                            <input type="text" id="sku" required>
                        </div>
                        <div class="form-group">
                            <label for="unit_cost">Unit Cost</label>
                            <input type="number" id="unit_cost" step="0.01" min="0" required>
                        </div>
                    </form>
                `,
                onSave: async () => {
                    // Get form values directly to ensure proper validation
                    const retailerId = document.getElementById('retailer_id').value;
                    const productId = document.getElementById('product_id').value;
                    const sku = document.getElementById('sku').value;
                    const unitCost = document.getElementById('unit_cost').value;
                    
                    // Validate required fields
                    if (!retailerId) throw new Error('Please select a retailer');
                    if (!productId) throw new Error('Please select a product');
                    if (!sku) throw new Error('Please enter a SKU');
                    if (!unitCost || unitCost <= 0) throw new Error('Please enter a valid unit cost');
                    
                    try {
                        const newAssignment = await DatabaseService.createProductAssignment({
                            retailer_id: retailerId,
                            product_id: productId,
                            sku: sku,
                            unit_cost: parseFloat(unitCost),
                            status: 'pending'
                        });
                        
                        // Fetch the complete assignment data with related entities
                        const fullAssignment = (await DatabaseService.getProductAssignments({
                            id: newAssignment.id
                        }))[0];
                        
                        table.addRow(fullAssignment);
                        window.toast.success('Product assigned successfully');
                    } catch (error) {
                        // Show more specific error message
                        window.toast.error(error.message || 'Failed to assign product');
                        throw error;
                    }
                }
            });
        });

    } catch (error) {
        console.error('Failed to load assignments:', error);
        window.toast.error('Failed to load assignments');
    }
}