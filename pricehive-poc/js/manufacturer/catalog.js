import { DataTable } from '../components/table.js';
import { DatabaseService } from '../database.js';
import { formatCurrency, formatPackageSize, formatDate } from '../utils.js';
import { CATEGORIES, PACKAGE_UNITS, PACKAGE_TYPES } from '../config.js';

export async function init(pageElement) {
    const columns = [
        { key: 'product_name', label: 'Product Name' },
        { key: 'brand', label: 'Brand' },
        { key: 'category', label: 'Category' },
        { key: 'package_info', label: 'Package', 
          format: (_, row) => formatPackageSize(
            row.package_size_quantity, 
            row.package_size_unit, 
            row.package_size_packaging
          )
        },
        { key: 'case_quantity', label: 'Case Qty' },
        { key: 'default_price', label: 'Default Price', 
          format: (value) => formatCurrency(value)
        },
        { key: 'status', label: 'Status',
          format: (value) => `<span class="status-badge status-${value.toLowerCase()}">${value}</span>`
        },
        { key: 'created_at', label: 'Created', 
          format: (value) => formatDate(value)
        }
    ];

    // Create table container
    const tableContainer = document.createElement('div');
    tableContainer.innerHTML = `
        <div class="page-header">
            <h1>Product Catalog</h1>
            <button class="btn btn-primary" id="add-product">Add Product</button>
        </div>
        <div id="product-table"></div>
    `;
    pageElement.innerHTML = '';
    pageElement.appendChild(tableContainer);

    try {
        // Fetch and display products
        const products = await DatabaseService.getProducts();
        const table = new DataTable('product-table', columns, products);

        // Add product button handler
        document.getElementById('add-product').addEventListener('click', () => {
            window.modal.create({
                title: 'Add New Product',
                content: `
                    <form id="product-form">
                        <div class="form-group">
                            <label for="product_name">Product Name</label>
                            <input type="text" id="product_name" required>
                        </div>
                        <div class="form-group">
                            <label for="brand">Brand</label>
                            <input type="text" id="brand" required>
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <select id="category" required>
                                ${CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="package_size_quantity">Package Size</label>
                                <input type="number" id="package_size_quantity" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label for="package_size_unit">Unit</label>
                                <select id="package_size_unit" required>
                                    ${PACKAGE_UNITS.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="package_size_packaging">Package Type</label>
                                <select id="package_size_packaging" required>
                                    ${PACKAGE_TYPES.map(type => `<option value="${type}">${type}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="case_quantity">Case Quantity</label>
                                <input type="number" id="case_quantity" required>
                            </div>
                            <div class="form-group">
                                <label for="default_price">Default Price</label>
                                <input type="number" id="default_price" step="0.01" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="upc">UPC</label>
                            <input type="text" id="upc" required pattern="[0-9]{12}" title="Please enter a valid 12-digit UPC">
                        </div>
                    </form>
                `,
                onSave: async () => {
                    const form = document.getElementById('product-form');
                    const formData = new FormData(form);
                    const productData = Object.fromEntries(formData.entries());
                    
                    try {
                        const newProduct = await DatabaseService.createProduct(productData);
                        table.addRow(newProduct);
                        window.toast.success('Product added successfully');
                    } catch (error) {
                        window.toast.error('Failed to add product');
                        throw error;
                    }
                }
            });
        });

    } catch (error) {
        console.error('Failed to load products:', error);
        window.toast.error('Failed to load products');
    }
}