// Database operations
class DatabaseService {
    // Product operations
    static async getProducts(manufacturerId = null) {
        let query = supabase.from('products').select('*');
        if (manufacturerId) {
            query = query.eq('manufacturer_id', manufacturerId);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    static async createProduct(productData) {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select();
        if (error) throw error;
        return data[0];
    }

    static async updateProduct(id, updates) {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    }

    // Retailer product operations
    static async getRetailerProducts(retailerId = null) {
        let query = supabase
            .from('retailer_products')
            .select(`
                *,
                product:products(*),
                retailer:organizations(name)
            `);
        if (retailerId) {
            query = query.eq('retailer_id', retailerId);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    // Price change operations
    static async createPriceChange(priceChangeData) {
        const { data, error } = await supabase
            .from('price_changes')
            .insert([priceChangeData])
            .select();
        if (error) throw error;
        return data[0];
    }

    static async updatePriceChangeStatus(id, status, rejectionReason = null) {
        const updates = { 
            status, 
            processed_at: new Date().toISOString() 
        };
        if (rejectionReason) {
            updates.rejection_reason = rejectionReason;
        }
        
        const { data, error } = await supabase
            .from('price_changes')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    }

    // Similar methods for discounts, organizations, etc.
}