export const CartTableQuery = `
CREATE TABLE IF NOT EXISTS Cart (
    _id TEXT,
    type TEXT NOT NULL,
    orderId TEXT PRIMARY KEY,
    totalBill REAL NOT NULL,
    totalItems INTEGER NOT NULL,
    orderDeliveryDateTime TEXT NOT NULL,
    instructions TEXT,
    customerId TEXT NOT NULL,
    customerAddressId TEXT NOT NULL,
    franchiseId TEXT NOT NULL,
    customerOrderedPackageId TEXT NOT NULL,
    customerOrderPromoId TEXT,
    customerOrderPaymentId TEXT,
    FOREIGN KEY (customerId) REFERENCES Customer(_id),
    FOREIGN KEY (customerAddressId) REFERENCES CustomerAddress(addressId),
    FOREIGN KEY (franchiseId) REFERENCES Franchise(franchiseId),
    FOREIGN KEY (customerOrderedPackageId) REFERENCES CustomerOrderedPackage(packageId),
    FOREIGN KEY (customerOrderPromoId) REFERENCES CustomerOrderPromo(promoId),
    FOREIGN KEY (customerOrderPaymentId) REFERENCES CustomerOrderPayment(paymentId)
);`;
