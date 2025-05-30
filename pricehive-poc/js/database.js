import { supabase } from './config.js';

// Database operations
export class DatabaseService {
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

    // Organization operations
    static async getOrganizations(type = null) {
        let query = supabase.from('organizations').select('*');
        if (type) {
            query = query.eq('type', type);
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    // Product assignment operations
    static async getProductAssignments(filters = {}) {
        let query = supabase
            .from('product_assignments')
            .select(`
                *,
                product:products(*),
                retailer:organizations!retailer_id(*),
                manufacturer:organizations!manufacturer_id(*)
            `);

        if (filters.retailerId) {
            query = query.eq('retailer_id', filters.retailerId);
        }
        if (filters.manufacturerId) {
            query = query.eq('manufacturer_id', filters.manufacturerId);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    static async createProductAssignment(assignmentData) {
        const { data, error } = await supabase
            .from('product_assignments')
            .insert([assignmentData])
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
    static async getPriceChanges(filters = {}) {
        let query = supabase
            .from('price_changes')
            .select(`
                *,
                product_assignment:product_assignments(
                    *,
                    product:products(*),
                    retailer:organizations!retailer_id(*),
                    manufacturer:organizations!manufacturer_id(*)
                ),
                proposed_by:user_profiles!proposed_by(*),
                reviewed_by:user_profiles!reviewed_by(*)
            `);

        if (filters.productAssignmentId) {
            query = query.eq('product_assignment_id', filters.productAssignmentId);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.proposedBy) {
            query = query.eq('proposed_by', filters.proposedBy);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

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

    // Discount operations
    static async getDiscounts(filters = {}) {
        let query = supabase
            .from('discounts')
            .select(`
                *,
                product_assignment:product_assignments(
                    *,
                    product:products(*),
                    retailer:organizations!retailer_id(*),
                    manufacturer:organizations!manufacturer_id(*)
                ),
                proposed_by:user_profiles!proposed_by(*),
                reviewed_by:user_profiles!reviewed_by(*)
            `);

        if (filters.productAssignmentId) {
            query = query.eq('product_assignment_id', filters.productAssignmentId);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.proposedBy) {
            query = query.eq('proposed_by', filters.proposedBy);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    static async createDiscount(discountData) {
        const { data, error } = await supabase
            .from('discounts')
            .insert([discountData])
            .select();
        if (error) throw error;
        return data[0];
    }

    static async updateDiscountStatus(id, status, rejectionReason = null) {
        const updates = {
            status,
            reviewed_at: new Date().toISOString()
        };
        if (rejectionReason) {
            updates.rejection_reason = rejectionReason;
        }

        const { data, error } = await supabase
            .from('discounts')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) throw error;
        return data[0];
    }

    // User profile operations
    static async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('user_profiles')
            .select(`
                *,
                organization:organizations(*)
            `)
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    }
}