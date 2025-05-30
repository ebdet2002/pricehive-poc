-- PriceHive POC Database Schema
-- File: data/schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations Table (Manufacturers and Retailers)
CREATE TABLE organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('manufacturer', 'retailer')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Table (Master product catalog)
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  manufacturer_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  upc VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(100),
  package_size_quantity DECIMAL(10,2),
  package_size_unit VARCHAR(50),
  package_size_packaging VARCHAR(50),
  case_quantity INTEGER,
  default_price DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Discontinued')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Retailer Products Table (Products assigned to retailers)
CREATE TABLE retailer_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  retailer_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  unit_cost DECIMAL(10,2),
  status VARCHAR(30) DEFAULT 'Active' 
    CHECK (status IN ('Active', 'Discontinued', 'Discontinued by Retailer')),
  date_effective TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(retailer_id, product_id)
);

-- Price Changes Table (Proposed price changes)
CREATE TABLE price_changes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  retailer_product_id UUID REFERENCES retailer_products(id) ON DELETE CASCADE,
  current_price DECIMAL(10,2),
  new_price DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'Pending' 
    CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  rejection_reason TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  requested_by VARCHAR(255) DEFAULT 'system@pricehive.com'
);

-- Discounts Table (Proposed discounts)
CREATE TABLE discounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  retailer_product_id UUID REFERENCES retailer_products(id) ON DELETE CASCADE,
  discount_type VARCHAR(20) CHECK (discount_type IN ('Percentage', 'Fixed Amount')),
  discount_category VARCHAR(50),
  discount_value DECIMAL(10,2),
  end_date DATE,
  status VARCHAR(20) DEFAULT 'Pending' 
    CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Active', 'Expired')),
  rejection_reason TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  requested_by VARCHAR(255) DEFAULT 'system@pricehive.com'
);

-- Price History Table (Audit trail of all price-related actions)
CREATE TABLE price_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  retailer_product_id UUID REFERENCES retailer_products(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'Product Added', 'Price Change', 'Discount Applied', etc.
  old_value DECIMAL(10,2),
  new_value DECIMAL(10,2),
  action_date TIMESTAMP DEFAULT NOW(),
  initiated_by VARCHAR(255) DEFAULT 'system@pricehive.com',
  notes TEXT,
  reference_id UUID -- Links to price_changes.id or discounts.id
);

-- Indexes for performance
CREATE INDEX idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX idx_products_upc ON products(upc);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_retailer_products_retailer ON retailer_products(retailer_id);
CREATE INDEX idx_retailer_products_product ON retailer_products(product_id);
CREATE INDEX idx_retailer_products_status ON retailer_products(status);
CREATE INDEX idx_price_changes_retailer_product ON price_changes(retailer_product_id);
CREATE INDEX idx_price_changes_status ON price_changes(status);
CREATE INDEX idx_discounts_retailer_product ON discounts(retailer_product_id);
CREATE INDEX idx_discounts_status ON discounts(status);
CREATE INDEX idx_price_history_retailer_product ON price_history(retailer_product_id);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_retailer_products_updated_at BEFORE UPDATE ON retailer_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();