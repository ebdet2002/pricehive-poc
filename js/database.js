@@ .. @@
     static async updatePriceChangeStatus(id, status, rejectionReason = null) {
         const updates = { 
             status, 
-            processed_at: new Date().toISOString() 
+            reviewed_at: new Date().toISOString(),
+            reviewed_by: (await supabase.auth.getUser()).data.user.id
         };
        if (rejectionReason) {
            updates.rejection_reason = rejectionReason;
        }
    }
@@ .. @@
    static async updateDiscountStatus(id, status, rejectionReason = null) {
        const updates = {
            status,
-            reviewed_at: new Date().toISOString()
+            reviewed_at: new Date().toISOString(),
+            reviewed_by: (await supabase.auth.getUser()).data.user.id
        };
        if (rejectionReason) {
            updates.rejection_reason = rejectionReason;
        }
    }