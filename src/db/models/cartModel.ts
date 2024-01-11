export const CartTableQuery = `
CREATE TABLE IF NOT EXISTS Cart (
    _id TEXT,
    type TEXT,
    orderId TEXT PRIMARY KEY,
    totalBill REAL NOT NULL,
    totalItems INTEGER NOT NULL,
    orderDeliveryDateTime TEXT NOT NULL,
    instructions TEXT,
    customerId TEXT,
    customerAddressId TEXT,
    franchiseId TEXT NOT NULL,
    customerOrderedPackageId TEXT,
    customerOrderPromoId TEXT,
    customerOrderPaymentId TEXT,
    FOREIGN KEY (customerId) REFERENCES Customer(_id),
    FOREIGN KEY (customerAddressId) REFERENCES CustomerAddress(addressId),
    FOREIGN KEY (franchiseId) REFERENCES Franchise(franchiseId),
    FOREIGN KEY (customerOrderedPackageId) REFERENCES CustomerOrderedPackage(packageId),
    FOREIGN KEY (customerOrderPromoId) REFERENCES CustomerOrderPromo(promoId),
    FOREIGN KEY (customerOrderPaymentId) REFERENCES CustomerOrderPayment(paymentId)
);`;
