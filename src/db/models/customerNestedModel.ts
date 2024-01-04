export const CustomerPackageTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerPackage (
    packageId TEXT PRIMARY KEY,
    packageName TEXT,
    totalNumberOfMeals INTEGER,
    numberOfDays INTEGER,
    timings INTEGER,
    numberOfWeeks INTEGER
);
`;

export const CustomerDaysTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerDays (
    dayId TEXT PRIMARY KEY,
    day TEXT NOT NULL,
    deliveryDate TEXT NOT NULL
);
`;

export const CustomerPaymentTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerPayment (
    paymentType TEXT NOT NULL,
    orderType TEXT NOT NULL
);
`;

export const CustomerPromoTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerPromo (
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    percent TEXT NOT NULL
);
`;

export const CustomerDeviceTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerDevice (
    deviceId TEXT PRIMARY KEY,
    isActive BOOLEAN NOT NULL
);
`;

export const CustomerPasswordTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerPassword (
    hash TEXT,
    password TEXT
);
`;

export const PreferenceTableQuery = `
CREATE TABLE IF NOT EXISTS Preference (
    preferenceId TEXT PRIMARY KEY
);
`;

export const CustomerProductOutlineTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerProductOutline (
    outlineId TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL
);
`;

export const CustomerProductInclusionTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerProductInclusion (
    inclusionId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    productInclusionId TEXT NOT NULL,
    FOREIGN KEY (productInclusionId) REFERENCES CustomerProductOutline(outlineId)
);
`;

export const PreferredCategoriesTableQuery = `
CREATE TABLE IF NOT EXISTS PreferredCategories (
    categoryId TEXT PRIMARY KEY,
    categoryName TEXT NOT NULL,
    preferenceId TEXT,
    FOREIGN KEY (preferenceId) REFERENCES Preference(preferenceId)
);
`;

export const PreferredSubCategoriesTableQuery = `
CREATE TABLE IF NOT EXISTS PreferredSubCategories (
    subCategoryId TEXT PRIMARY KEY,
    subCategoryName TEXT NOT NULL,
    preferenceId TEXT,
    FOREIGN KEY (preferenceId) REFERENCES Preference(preferenceId)
);
`;
