import { DataTable } from '../components/table.js';
import { DatabaseService } from '../database.js';
import { formatCurrency, formatDate } from '../utils.js';
import { REJECTION_REASONS } from '../config.js';

export async function init(pageElement) {
    const columns = [
        { key: 'manufacturer', label: 'Manufacturer',
          format: (_, row) => row.product_assignment.manufacturer.name },
        { key: 'product', label: 'Product',
          format: (_, row) => row.product_assignment.product.name },
        { key: 'type', label: 'Type',
          format: (_, row) => row.hasOwnProperty('new_price') ? 'Price Change' : 'Discount' },
        { key: 'details', label: 'Details',
          format: (_, row) => {
              if (row.hasOwnProperty('new_price')) {
                  return `${formatCurrency(row.current_price)} → ${formatCurrency(row.new_price)}`;
              } else {
                  return `${row.type === 'percentage' ? row.value + '%' : formatCurrency(row.value)} ${row.category}`;
              }
          }
        },
        { key: 'start_date', label: 'Start Date',
          format: (value) => formatDate(value) },
        { key: 'end_date', label: 'End Date',
          format: (value) => value ? formatDate(value) : 'N/A' },
        { key: 'status', label: 'Status',
          format: (value) => `<span class="status-badge status-${value.toLowerCase()}">${value}</span>` }
    ];

    // Create page structure
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="page-header">
            <h1>Approvals</h1>
        </div>
        <div class="tabs">
            <button class="tab-btn active" data-type="price-changes">Price Changes</button>
            <button class="tab-btn" data-type="discounts">Discounts</button>
        </div>
        <div id="approvals-table"></div>
    `;
    pageElement.innerHTML = '';
    pageElement.appendChild(container);

    let currentType = 'price-changes';
    let table;

    async function loadData(type) {
        try {
            let data;
            if (type === 'price-changes') {
                data = await DatabaseService.getPriceChanges({ status: 'pending' });
            } else {
                data = await DatabaseService.getDiscounts({ status: 'pending' });
            }
            
            if (table) {
                table.refresh(data);
            } else {
                table = new DataTable('approvals-table', columns, data);
                
                // Add click handler for rows
                document.getElementById('approvals-table').addEventListener('click', (e) => {
                    const row = e.target.closest('tr');
                    if (row) {
                        const id = row.dataset.id;
                        const item = data.find(d => d.id === id);
                        if (item) {
                            showApprovalModal(item, type);
                        }
                    }
                });
            }
        } catch (error) {
            console.error(`Failed to load ${type}:`, error);
            window.toast.error(`Failed to load ${type}`);
        }
    }

    // Handle tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (btn.classList.contains('active')) return;
            
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentType = btn.dataset.type;
            await loadData(currentType);
        });
    });

    function showApprovalModal(item, type) {
        const isDiscount = type === 'discounts';
        const title = isDiscount ? 'Review Discount' : 'Review Price Change';
        
        window.modal.create({
            title,
            content: `
                <div class="review-details">
                    <h3>${item.product_assignment.product.name}</h3>
                    <p><strong>Manufacturer:</strong> ${item.product_assignment.manufacturer.name}</p>
                    ${isDiscount ? `
                        <p><strong>Type:</strong> ${item.type}</p>
                        <p><strong>Value:</strong> ${item.type === 'percentage' ? item.value + '%' : formatCurrency(item.value)}</p>
                        <p><strong>Category:</strong> ${item.category}</p>
                    ` : `
                        <p><strong>Current Price:</strong> ${formatCurrency(item.current_price)}</p>
                        <p><strong>New Price:</strong> ${formatCurrency(item.new_price)}</p>
                        <p><strong>Change:</strong> ${((item.new_price - item.current_price) / item.current_price * 100).toFixed(1)}%</p>
                    `}
                    <p><strong>Start Date:</strong> ${formatDate(item.start_date)}</p>
                    <p><strong>End Date:</strong> ${item.end_date ? formatDate(item.end_date) : 'N/A'}</p>
                </div>
                <div class="form-group">
                    <label for="status">Decision</label>
                    <select id="status" required>
                        <option value="">Select Decision</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                    </select>
                </div>
                <div class="form-group" id="rejection-reason-group" style="display: none;">
                    <label for="rejection_reason">Rejection Reason</label>
                    <select id="rejection_reason">
                        <option value="">Select Reason</option>
                        ${REJECTION_REASONS.map(reason => `
                            <option value="${reason}">${reason}</option>
                        `).join('')}
                    </select>
                </div>
            `,
            onSave: async () => {
                const status = document.getElementById('status').value;
                const rejectionReason = document.getElementById('rejection_reason').value;
                
                if (!status) {
                    throw new Error('Please select a decision');
                }
                if (status === 'rejected' && !rejectionReason) {
                    throw new Error('Please select a rejection reason');
                }
                
                try {
                    if (isDiscount) {
                        await DatabaseService.updateDiscountStatus(item.id, status, rejectionReason);
                    } else {
                        await DatabaseService.updatePriceChangeStatus(item.id, status, rejectionReason);
                    }
                    
                    await loadData(currentType);
                    window.toast.success(`${isDiscount ? 'Discount' : 'Price change'} ${status}`);
                } catch (error) {
                    window.toast.error(`Failed to update status`);
                    throw error;
                }
            }
        });

        // Show/hide rejection reason based on status
        document.getElementById('status').addEventListener('change', (e) => {
            const reasonGroup = document.getElementById('rejection-reason-group');
            reasonGroup.style.display = e.target.value === 'rejected' ? 'block' : 'none';
        });
    }

    // Load initial data
    await loadData(currentType);
}