-- PriceHive POC Sample Data
-- File: data/seeds/sample_data.sql

-- Sample Organizations
INSERT INTO organizations (id, name, type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Beverages Inc.', 'manufacturer'),
  ('22222222-2222-2222-2222-222222222222', 'Fresh Foods Manufacturing', 'manufacturer'),
  ('33333333-3333-3333-3333-333333333333', 'SuperMart Retail Chain', 'retailer'),
  ('44444444-4444-4444-4444-444444444444', 'Corner Store Network', 'retailer'),
  ('55555555-5555-5555-5555-555555555555', 'Premium Grocers Ltd.', 'retailer');

-- Sample Products for Acme Beverages
INSERT INTO products (id, manufacturer_id, upc, product_name, brand, category, package_size_quantity, package_size_unit, package_size_packaging, case_quantity, default_price, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '123456789012', 'Cola Classic', 'Acme Cola', 'Soft Drink', 12, 'oz', 'Can', 24, 2.50, 'Active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '123456789013', 'Orange Fizz', 'Acme', 'Soft Drink', 12, 'oz', 'Can', 24, 2.25, 'Active'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', '123456789014', 'Sparkling Water Lime', 'Acme Pure', 'Sparkling Water', 16.9, 'oz', 'Bottle', 12, 1.75, 'Active'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '123456789015', 'Energy Boost', 'Acme Energy', 'Energy Drinks', 8.4, 'oz', 'Can', 12, 3.25, 'Active'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', '123456789016', 'Cold Brew Coffee', 'Acme Coffee', 'Coffee', 11, 'oz', 'Bottle', 12, 4.50, 'Active');

-- Sample Products for Fresh Foods Manufacturing
INSERT INTO products (id, manufacturer_id, upc, product_name, brand, category, package_size_quantity, package_size_unit, package_size_packaging, case_quantity, default_price, status) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', '234567890123', 'Whole Milk', 'Fresh Valley', 'Dairy', 1, 'gallon', 'Jug', 4, 3.99, 'Active'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', '234567890124', 'Greek Yogurt Vanilla', 'Fresh Valley', 'Dairy', 32, 'oz', 'Container', 6, 5.49, 'Active'),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '22222222-2222-2222-2222-222222222222', '234567890125', 'Oat Milk Original', 'Fresh Alternative', 'Dairy Alternatives', 64, 'oz', 'Carton', 6, 4.29, 'Active'),
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '22222222-2222-2222-2222-222222222222', '234567890126', 'Frozen Strawberries', 'Fresh Valley', 'Frozen Goods', 16, 'oz', 'Bag', 12, 2.99, 'Active'),
  ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '22222222-2222-2222-2222-222222222222', '234567890127', 'Cheddar Cheese Slices', 'Fresh Valley', 'Dairy', 8, 'oz', 'Package', 12, 3.79, 'Active');

-- Sample Retailer Products (Products assigned to retailers)
INSERT INTO retailer_products (id, retailer_id, product_id, sku, unit_cost, status, date_effective) VALUES
  -- SuperMart products
  ('rp111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SM-COLA-001', 2.50, 'Active', '2024-01-15'),
  ('rp222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SM-ORANGE-002', 2.25, 'Active', '2024-01-15'),
  ('rp333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'SM-SPARKLING-003', 1.75, 'Active', '2024-02-01'),
  ('rp444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'SM-MILK-004', 3.99, 'Active', '2024-01-20'),
  ('rp555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'SM-YOGURT-005', 5.49, 'Active', '2024-01-25'),
  
  -- Corner Store products
  ('rp666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CS-COLA-001', 2.75, 'Active', '2024-02-01'),
  ('rp777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'CS-ENERGY-002', 3.25, 'Active', '2024-02-05'),
  ('rp888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'CS-COFFEE-003', 4.50, 'Active', '2024-02-10'),
  
  -- Premium Grocers products
  ('rp999999-9999-9999-9999-999999999999', '55555555-5555-5555-5555-555555555555', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'PG-OATMILK-001', 4.29, 'Active', '2024-02-15'),
  ('rp101010-1010-1010-1010-101010101010', '55555555-5555-5555-5555-555555555555', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'PG-CHEESE-002', 3.79, 'Active', '2024-02-20');

-- Sample Price Changes (Some pending, some approved, some rejected)
INSERT INTO price_changes (id, retailer_product_id, current_price, new_price, start_date, status, requested_at, processed_at, rejection_reason, requested_by) VALUES
  ('pc111111-1111-1111-1111-111111111111', 'rp111111-1111-1111-1111-111111111111', 2.50, 2.75, '2024-03-01', 'Pending', '2024-02-25 10:00:00', NULL, NULL, 'manufacturer@acmebev.com'),
  ('pc222222-2222-2222-2222-222222222222', 'rp222222-2222-2222-2222-222222222222', 2.25, 2.40, '2024-03-01', 'Approved', '2024-02-20 14:30:00', '2024-02-22 09:15:00', NULL, 'manufacturer@acmebev.com'),
  ('pc333333-3333-3333-3333-333333333333', 'rp666666-6666-6666-6666-666666666666', 2.75, 3.00, '2024-03-15', 'Rejected', '2024-02-28 11:45:00', '2024-03-01 16:20:00', 'Price increase too high', 'manufacturer@acmebev.com'),
  ('pc444444-4444-4444-4444-444444444444', 'rp444444-4444-4444-4444-444444444444', 3.99, 4.19, '2024-04-01', 'Pending', '2024-03-15 13:00:00', NULL, NULL, 'manufacturer@freshfoods.com');

-- Sample Discounts
INSERT INTO discounts (id, retailer_product_id, discount_type, discount_category, discount_value, end_date, status, requested_at, processed_at, requested_by) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'rp333333-3333-3333-3333-333333333333', 'Percentage', 'Temporary Price Reduction', 15.00, '2024-04-30', 'Approved', '2024-03-01 09:00:00', '2024-03-02 10:30:00', 'manufacturer@acmebev.com'),
  ('d2222222-2222-2222-2222-222222222222', 'rp777777-7777-7777-7777-777777777777', 'Fixed Amount', 'Feature Sale', 0.50, '2024-05-15', 'Pending', '2024-03-10 11:15:00', NULL, 'manufacturer@acmebev.com'),
  ('d3333333-3333-3333-3333-333333333333', 'rp555555-5555-5555-5555-555555555555', 'Percentage', 'Seasonal Sale', 20.00, '2024-06-30', 'Rejected', '2024-03-05 14:20:00', '2024-03-07 08:45:00', 'manufacturer@freshfoods.com');

-- Sample Price History
INSERT INTO price_history (retailer_product_id, action_type, old_value, new_value, action_date, initiated_by, notes, reference_id) VALUES
  ('rp111111-1111-1111-1111-111111111111', 'Product Added', NULL, 2.50, '2024-01-15 12:00:00', 'retailer@supermart.com', 'Initial product setup', NULL),
  ('rp222222-2222-2222-2222-222222222222', 'Product Added', NULL, 2.25, '2024-01-15 12:05:00', 'retailer@supermart.com', 'Initial product setup', NULL),
  ('rp222222-2222-2222-2222-222222222222', 'Price Change Approved', 2.25, 2.40, '2024-02-22 09:15:00', 'retailer@supermart.com', 'Approved price increase', 'pc222222-2222-2222-2222-222222222222'),
  ('rp333333-3333-3333-3333-333333333333', 'Product Added', NULL, 1.75, '2024-02-01 10:30:00', 'retailer@supermart.com', 'Initial product setup', NULL),
  ('rp333333-3333-3333-3333-333333333333', 'Discount Applied', 1.75, 1.49, '2024-03-02 10:30:00', 'retailer@supermart.com', '15% temporary discount approved', 'd1111111-1111-1111-1111-111111111111'),
  ('rp666666-6666-6666-6666-666666666666', 'Product Added', NULL, 2.75, '2024-02-01 14:20:00', 'retailer@cornerstore.com', 'Initial product setup', NULL),
  ('rp666666-6666-6666-6666-666666666666', 'Price Change Rejected', 2.75, 3.00, '2024-03-01 16:20:00', 'retailer@cornerstore.com', 'Price increase rejected - too high', 'pc333333-3333-3333-3333-333333333333');