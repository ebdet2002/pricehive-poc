// Supabase configuration
export const SUPABASE_URL = 'your-supabase-url';
export const SUPABASE_ANON_KEY = 'your-anon-key';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// App constants
export const CATEGORIES = [
    'Dairy', 'Dairy Alternatives', 'Sparkling Water', 'Coffee',
    'Coffee Alternative', 'Energy Drinks', 'Soft Drink', 'Sports Drink',
    'Juice', 'Sweet Snacks', 'Salt Snacks', 'Frozen Goods', 'Frozen Dairy'
];

export const PACKAGE_UNITS = ['oz', 'ml', 'l', 'g', 'kg', 'lb'];
export const PACKAGE_TYPES = ['Can', 'Bottle', 'Box', 'Bag', 'Pouch', 'Jar'];

export const DISCOUNT_CATEGORIES = [
    'Temporary Price Reduction', 'Seasonal Sale', 'Feature Sale', 'Display Sale'
];

export const REJECTION_REASONS = [
    'Incorrect value', 'Price change not authorized', 
    'Discount not authorized', 'Product not authorized'
];