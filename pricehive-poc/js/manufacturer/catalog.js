import { DataTable } from '../components/table.js';
import { DatabaseService } from '../database.js';
import { formatCurrency, formatPackageSize, formatDate } from '../utils.js';
import { supabase, CATEGORIES, PACKAGE_UNITS, PACKAGE_TYPES } from '../config.js';

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
        const [products, categories] = await Promise.all([
            DatabaseService.getProducts(),
            DatabaseService.getCategories()
        ]);
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
                                <option value="">Select Category</option>
                                ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
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
                    // Get form values directly to ensure proper validation
                    const name = document.getElementById('product_name').value;
                    const brand = document.getElementById('brand').value;
                    const categoryId = document.getElementById('category').value;
                    const packageSizeQuantity = document.getElementById('package_size_quantity').value;
                    const packageSizeUnit = document.getElementById('package_size_unit').value;
                    const packageSizePackaging = document.getElementById('package_size_packaging').value;
                    const caseQuantity = document.getElementById('case_quantity').value;
                    const defaultPrice = document.getElementById('default_price').value;
                    const upc = document.getElementById('upc').value;
                    
                    // Validate required fields
                    if (!name) throw new Error('Please enter a product name');
                    if (!brand) throw new Error('Please enter a brand');
                    if (!categoryId) throw new Error('Please select a category');
                    if (!packageSizeQuantity || packageSizeQuantity <= 0) throw new Error('Please enter a valid package size quantity');
                    if (!packageSizeUnit) throw new Error('Please select a package size unit');
                    if (!packageSizePackaging) throw new Error('Please select a package type');
                    if (!caseQuantity || caseQuantity <= 0) throw new Error('Please enter a valid case quantity');
                    if (!defaultPrice || defaultPrice <= 0) throw new Error('Please enter a valid default price');
                    if (!upc || !/^\d{12}$/.test(upc)) throw new Error('Please enter a valid 12-digit UPC');
                    
                    // Get the current user's organization (manufacturer) ID
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) throw new Error('User not authenticated');
                    
                    const { data: userProfile } = await supabase
                        .from('user_profiles')
                        .select('organization_id')
                        .eq('id', user.id)
                        .single();
                    
                    if (!userProfile?.organization_id) throw new Error('User organization not found');
                    
                    try {
                        const newProduct = await DatabaseService.createProduct({
                            name,
                            brand,
                            category_id: categoryId,
                            package_size_quantity: parseFloat(packageSizeQuantity),
                            package_size_unit: packageSizeUnit,
                            package_size_packaging: packageSizePackaging,
                            case_quantity: parseInt(caseQuantity),
                            default_price: parseFloat(defaultPrice),
                            upc,
                            manufacturer_id: userProfile.organization_id,
                            status: 'active'
                        });
                        
                        table.addRow(newProduct);
                        window.toast.success('Product added successfully');
                    } catch (error) {
                        window.toast.error(error.message || 'Failed to add product');
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