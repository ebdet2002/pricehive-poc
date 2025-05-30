import { Modal } from './components/modal.js';
import { Toast } from './components/toast.js';
import { DataTable } from './components/table.js';
import { DatabaseService } from './database.js';
import * as config from './config.js';
import * as utils from './utils.js';

// Initialize retailer dashboard
function initRetailerDashboard() {
    // Initialize components
    window.modal = new Modal();
    window.toast = new Toast();
    
    // Load initial page
    const currentPage = window.location.hash.slice(1) || 'assortment';
    loadPage(currentPage);
    
    // Handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);
        });
    });
}

function loadPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.classList.add('active');
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === page);
        });
    }
}

document.addEventListener('DOMContentLoaded', initRetailerDashboard);