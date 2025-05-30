# PriceHive POC

A price management platform connecting Manufacturers with Retailers.

## Setup

1. Install Supabase CLI (optional for local development)
2. Configure your Supabase URL and anon key in `js/config.js`
3. Run the SQL schema in `data/sample-data.sql` in your Supabase project
4. Serve the files using a local server (e.g., `python -m http.server` or Live Server extension)

## Structure

- `index.html` - Landing page with role selection
- `manufacturer.html` - Manufacturer dashboard
- `retailer.html` - Retailer dashboard
- `css/` - Stylesheets
- `js/` - JavaScript modules organized by feature
- `data/` - Database schema and sample data

## Features

- Product catalog management
- Retailer-manufacturer relationships
- Price change proposals and approvals
- Discount management
- Historical tracking
