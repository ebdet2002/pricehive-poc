/*
  # Sample Data Migration
  
  1. Initial Setup
    - Clears existing data
    - Creates base organizations and categories
    - Sets up user profiles
  
  2. Product Data
    - Adds products for manufacturers
    - Creates product assignments
  
  3. Price Changes and Discounts
    - Adds sample price changes with proper review data
    - Creates discount records
    - Adds audit trail entries
*/

-- Truncate tables in dependency order to clear existing data
TRUNCATE TABLE audit_logs RESTART IDENTITY CASCADE;
TRUNCATE TABLE price_changes RESTART IDENTITY CASCADE;
TRUNCATE TABLE discounts RESTART IDENTITY CASCADE;
TRUNCATE TABLE product_assignments RESTART IDENTITY CASCADE;
TRUNCATE TABLE products RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_profiles RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;
TRUNCATE TABLE organizations RESTART IDENTITY CASCADE;

-- Sample Organizations
INSERT INTO organizations (id, name, type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Beverages Inc.', 'manufacturer'),
  ('22222222-2222-2222-2222-222222222222', 'Fresh Foods Manufacturing', 'manufacturer'),
  ('33333333-3333-3333-3333-333333333333', 'SuperMart Retail Chain', 'retailer'),
  ('44444444-4444-4444-4444-444444444444', 'Corner Store Network', 'retailer'),
  ('55555555-5555-5555-5555-555555555555', 'Premium Grocers Ltd.', 'retailer');

-- Sample Categories (These must be inserted before products)
INSERT INTO categories (id, name) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Dairy'),
  ('c2222222-2222-2222-2222-222222222222', 'Dairy Alternatives'),
  ('c3333333-3333-3333-3333-333333333333', 'Sparkling Water'),
  ('c4444444-4444-4444-4444-c44444444444', 'Coffee'),
  ('c5555555-5555-5555-5555-c55555555555', 'Coffee Alternative'),
  ('c6666666-6666-6666-6666-c66666666666', 'Energy Drinks'),
  ('c7777777-7777-7777-7777-c77777777777', 'Soft Drink'),
  ('c8888888-8888-8888-8888-c88888888888', 'Sports Drink'),
  ('c9999999-9999-9999-9999-c99999999999', 'Juice'),
  ('caaaaaaa-aaaa-aaaa-aaaa-caaaaaaaaaaa', 'Sweet Snacks'),
  ('cbbbbbbb-bbbb-bbbb-bbbb-cbbbbbbbbbbb', 'Salt Snacks'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Frozen Goods'),
  ('cddddddd-dddd-dddd-dddd-cddddddddddd', 'Frozen Dairy');

-- Sample User Profiles
-- IMPORTANT: Replace the 'id' values below with actual user IDs from your Supabase auth.users table.
-- You must create these users in Supabase Authentication first.
INSERT INTO user_profiles (id, organization_id, full_name, role, is_active) VALUES
  ('1b01a71e-523e-45b8-a6dd-29e850fc9d11', '11111111-1111-1111-1111-111111111111', 'Manufacturer User', 'manufacturer', TRUE),
  ('e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '33333333-3333-3333-3333-333333333333', 'Retailer User', 'retailer', TRUE),
  ('877b638a-2363-4390-9954-3e945f089706', NULL, 'Admin User', 'admin', TRUE);

-- Sample Products for Acme Beverages
INSERT INTO products (id, manufacturer_id, upc, name, brand, category_id, package_size_quantity, package_size_unit, package_size_packaging, case_quantity, default_price, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '123456789012', 'Cola Classic', 'Acme Cola', (SELECT id FROM categories WHERE name = 'Soft Drink'), 12, 'oz', 'can', 24, 2.50, 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '123456789013', 'Orange Fizz', 'Acme', (SELECT id FROM categories WHERE name = 'Soft Drink'), 12, 'oz', 'can', 24, 2.25, 'active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '123456789014', 'Sparkling Water Lime', 'Acme Pure', (SELECT id FROM categories WHERE name = 'Sparkling Water'), 16.9, 'oz', 'bottle', 12, 1.75, 'active'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '123456789015', 'Energy Boost', 'Acme Energy', (SELECT id FROM categories WHERE name = 'Energy Drinks'), 8.4, 'oz', 'can', 12, 3.25, 'active'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', '123456789016', 'Cold Brew Coffee', 'Acme Coffee', (SELECT id FROM categories WHERE name = 'Coffee'), 11, 'oz', 'bottle', 12, 4.50, 'active');

-- Sample Products for Fresh Foods Manufacturing
INSERT INTO products (id, manufacturer_id, upc, name, brand, category_id, package_size_quantity, package_size_unit, package_size_packaging, case_quantity, default_price, status) VALUES
  ('7a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', '22222222-2222-2222-2222-222222222222', '234567890123', 'Whole Milk', 'Fresh Valley', (SELECT id FROM categories WHERE name = 'Dairy'), 1, 'l', 'carton', 4, 3.99, 'active'),
  ('1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', '22222222-2222-2222-2222-222222222222', '234567890124', 'Greek Yogurt Vanilla', 'Fresh Valley', (SELECT id FROM categories WHERE name = 'Dairy'), 32, 'oz', 'jar', 6, 5.49, 'active'),
  ('2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b', '22222222-2222-2222-2222-222222222222', '234567890125', 'Oat Milk Original', 'Fresh Alternative', (SELECT id FROM categories WHERE name = 'Dairy Alternatives'), 64, 'oz', 'carton', 6, 4.29, 'active'),
  ('3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c', '22222222-2222-2222-2222-222222222222', '234567890126', 'Frozen Strawberries', 'Fresh Valley', (SELECT id FROM categories WHERE name = 'Frozen Goods'), 16, 'oz', 'bag', 12, 2.99, 'active'),
  ('4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d', '22222222-2222-2222-2222-222222222222', '234567890127', 'Cheddar Cheese Slices', 'Fresh Valley', (SELECT id FROM categories WHERE name = 'Dairy'), 8, 'oz', 'pack', 12, 3.79, 'active');

-- Sample Product Assignments (Products assigned to retailers)
INSERT INTO product_assignments (id, retailer_id, product_id, sku, unit_cost, status, effective_date, manufacturer_id) VALUES
  -- SuperMart products
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SM-COLA-001', 2.50, 'active', '2024-01-15', '11111111-1111-1111-1111-111111111111'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SM-ORANGE-002', 2.25, 'active', '2024-01-15', '11111111-1111-1111-1111-111111111111'),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'SM-SPARKLING-003', 1.75, 'active', '2024-02-01', '11111111-1111-1111-1111-111111111111'),
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '33333333-3333-3333-3333-333333333333', '7a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'SM-MILK-004', 3.99, 'active', '2024-01-20', '22222222-2222-2222-2222-222222222222'),
  ('e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', '33333333-3333-3333-3333-333333333333', '1c2d3e4f-5a6b-7c8d-9e0f-1a2b3c4d5e6f', 'SM-YOGURT-005', 5.49, 'active', '2024-01-25', '22222222-2222-2222-2222-222222222222'),
  
  -- Corner Store products
  ('f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CS-COLA-001', 2.75, 'active', '2024-02-01', '11111111-1111-1111-1111-111111111111'),
  ('0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', '44444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'CS-ENERGY-002', 3.25, 'active', '2024-02-05', '11111111-1111-1111-1111-111111111111'),
  ('1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e', '44444444-4444-4444-4444-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'CS-COFFEE-003', 4.50, 'active', '2024-02-10', '11111111-1111-1111-1111-111111111111'),
  
  -- Premium Grocers products
  ('2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f', '55555555-5555-5555-5555-555555555555', '2e3f4a5b-6c7d-8e9f-0a1b-2c3d4e5f6a7b', 'PG-OATMILK-001', 4.29, 'active', '2024-02-15', '22222222-2222-2222-2222-222222222222'),
  ('3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a', '55555555-5555-5555-5555-555555555555', '4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d', 'PG-CHEESE-002', 3.79, 'active', '2024-02-20', '22222222-2222-2222-2222-222222222222');

-- Sample Price Changes (Some pending, some approved, some rejected)
INSERT INTO price_changes (id, product_assignment_id, proposed_by, current_price, new_price, start_date, end_date, status, reviewed_by, reviewed_at, rejection_reason, created_at) VALUES
  ('4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '1b01a71e-523e-45b8-a6dd-29e850fc9d11', 2.50, 2.75, '2024-03-01 00:00:00+00', NULL, 'pending', NULL, NULL, NULL, '2024-02-25 10:00:00+00'),
  ('5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', '1b01a71e-523e-45b8-a6dd-29e850fc9d11', 2.25, 2.40, '2024-03-01 00:00:00+00', NULL, 'approved', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-02-22 09:15:00+00', NULL, '2024-02-20 14:30:00+00'),
  ('6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d', 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', '1b01a71e-523e-45b8-a6dd-29e850fc9d11', 2.75, 3.00, '2024-03-15 00:00:00+00', NULL, 'rejected', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-03-01 16:20:00+00', 'Price increase too high', '2024-02-28 11:45:00+00'),
  ('7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e', 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', '1b01a71e-523e-45b8-a6dd-29e850fc9d11', 3.99, 4.19, '2024-04-01 00:00:00+00', NULL, 'pending', NULL, NULL, NULL, '2024-03-15 13:00:00+00');

-- Sample Discounts
INSERT INTO discounts (id, product_assignment_id, type, category, value, start_date, end_date, status, created_at, reviewed_at, proposed_by, reviewed_by) VALUES
  ('8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'percentage', 'temporary_price_reduction', 15.00, '2024-03-01 00:00:00+00', '2024-04-30 00:00:00+00', 'approved', '2024-03-01 09:00:00+00', '2024-03-02 10:30:00+00', '1b01a71e-523e-45b8-a6dd-29e850fc9d11', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d'),
  ('9d0e1f2a-3b4c-5d6e-7f8a-9b0c1d2e3f4a', '0a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 'fixed_amount', 'feature_sale', 0.50, '2024-03-10 00:00:00+00', '2024-05-15 00:00:00+00', 'pending', '2024-03-10 11:15:00+00', NULL, '1b01a71e-523e-45b8-a6dd-29e850fc9d11', NULL),
  ('0e1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b', 'e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0', 'percentage', 'seasonal_sale', 20.00, '2024-03-05 00:00:00+00', '2024-06-30 00:00:00+00', 'rejected', '2024-03-05 14:20:00+00', '2024-03-07 08:45:00+00', '1b01a71e-523e-45b8-a6dd-29e850fc9d11', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d');

-- Sample Audit Logs
INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, user_id, created_at) VALUES
  ('product_assignments', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'INSERT', NULL, '{"unit_cost": 2.50, "status": "active"}', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-01-15 12:00:00+00'),
  ('product_assignments', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'INSERT', NULL, '{"unit_cost": 2.25, "status": "active"}', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-01-15 12:05:00+00'),
  ('price_changes', '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c', 'UPDATE', '{"current_price": 2.25, "status": "pending"}', '{"new_price": 2.40, "status": "approved"}', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-02-22 09:15:00+00'),
  ('product_assignments', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'INSERT', NULL, '{"unit_cost": 1.75, "status": "active"}', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-02-01 10:30:00+00'),
  ('discounts', '8c9d0e1f-2a3b-4c5d-6e7f-8a9b0c1d2e3f', 'UPDATE', '{"status": "pending"}', '{"status": "approved"}', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-03-02 10:30:00+00'),
  ('product_assignments', 'f6a7b8c9-d0e1-f2a3-b4c5-d6e7f8a9b0c1', 'INSERT', NULL, '{"unit_cost": 2.75, "status": "active"}', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-02-01 14:20:00+00'),
  ('price_changes', '6a7b8c9d-0e1f-2a3b-4c5d-6e7f8a9b0c1d', 'UPDATE', '{"current_price": 2.75, "status": "pending"}', '{"new_price": 3.00, "status": "rejected"}', 'e3da2a87-8b6c-4064-9d72-fbc3eb3afc0d', '2024-03-01 16:20:00+00');