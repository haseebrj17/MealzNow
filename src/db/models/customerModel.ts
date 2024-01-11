export const CustomerTableQuery = `
CREATE TABLE IF NOT EXISTS Customer (
    _id TEXT PRIMARY KEY,
    type TEXT,
    fullName TEXT NOT NULL,
    emailAddress TEXT NOT NULL,
    contactNumber TEXT NOT NULL,
    password TEXT NOT NULL,
    isNumberVerified BOOLEAN NOT NULL,
    isEmailVerified BOOLEAN NOT NULL,
    cityId TEXT,
    preferenceId TEXT,
    customerProductOutlineId TEXT,
    customerPackageId TEXT,
    customerPromoId TEXT,
    customerPaymentId TEXT,
    customerPasswordId TEXT,
    customerDeviceId TEXT,
    FOREIGN KEY (preferenceId) REFERENCES Preference(preferenceId),
    FOREIGN KEY (customerProductOutlineId) REFERENCES CustomerProductOutline(outlineId),
    FOREIGN KEY (customerPackageId) REFERENCES CustomerPackage(packageId),
    FOREIGN KEY (customerPromoId) REFERENCES CustomerPromo(type),
    FOREIGN KEY (customerPaymentId) REFERENCES CustomerPayment(paymentType),
    FOREIGN KEY (customerPasswordId) REFERENCES CustomerPassword(hash),
    FOREIGN KEY (customerDeviceId) REFERENCES CustomerDevice(deviceId)
);
`;
