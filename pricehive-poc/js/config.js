import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    PACKAGE_UNITS,
    PACKAGE_TYPES,
    DISCOUNT_CATEGORIES,
    REJECTION_REASONS
};