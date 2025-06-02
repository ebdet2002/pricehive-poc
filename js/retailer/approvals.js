try {
                     if (isDiscount) {
                        await DatabaseService.updateDiscountStatus(
                            item.id,
                            status,
                            rejectionReason
                        );
                    } else {
                        await DatabaseService.updatePriceChangeStatus(
                            item.id,
                            status,
                            rejectionReason
                        );
                    }
}