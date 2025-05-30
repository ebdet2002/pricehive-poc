import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// App constants
const CATEGORIES = [
    'Dairy', 'Dairy Alternatives', 'Sparkling Water', 'Coffee',
    'Coffee Alternative', 'Energy Drinks', 'Soft Drink', 'Sports Drink',
    'Juice', 'Sweet Snacks', 'Salt Snacks', 'Frozen Goods', 'Frozen Dairy'
];

const PACKAGE_UNITS = ['oz', 'ml', 'l', 'g', 'kg', 'lb'];
const PACKAGE_TYPES = ['Can', 'Bottle', 'Box', 'Bag', 'Pouch', 'Jar'];

const DISCOUNT_CATEGORIES = [
    'Temporary Price Reduction', 'Seasonal Sale', 'Feature Sale', 'Display Sale'
];

const REJECTION_REASONS = [
    'Incorrect value', 'Price change not authorized', 
    'Discount not authorized', 'Product not authorized'
];

export {
    supabase,
    CATEGORIES,
    PACKAGE_UNITS,
    PACKAGE_TYPES,
    DISCOUNT_CATEGORIES,
    REJECTION_REASONS
};