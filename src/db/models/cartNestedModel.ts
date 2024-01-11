export const CustomerOrderedPackageTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerOrderedPackage (
    packageId TEXT PRIMARY KEY,
    packageName TEXT,
    totalNumberOfMeals INTEGER,
    numberOfDays INTEGER,
    timings INTEGER,
    numberOfWeeks INTEGER
);
`;

export const CustomerOrderDaysTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerOrderDays (
    dayId TEXT PRIMARY KEY,
    day TEXT NOT NULL,
    deliveryDate TEXT NOT NULL
);
`;

export const CustomerOrderPromoTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerOrderPromo (
    promoId TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    percent TEXT NOT NULL
);
`;

export const CustomerOrderPaymentTableQuery = `
CREATE TABLE IF NOT EXISTS CustomerOrderPayment (
    paymentType TEXT NOT NULL,
    orderType TEXT NOT NULL
);
`;

export const ProductByDayTableQuery = `
CREATE TABLE IF NOT EXISTS ProductByDay (
    dayId TEXT PRIMARY KEY,
    day TEXT NOT NULL,
    deliveryDate TEXT NOT NULL,
    orderId TEXT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Cart(orderId)
);
`;

export const ProductByTimingTableQuery = `
CREATE TABLE IF NOT EXISTS ProductByTiming (
    productTimingId TEXT PRIMARY KEY,
    dayId TEXT NOT NULL,
    timeOfDayId TEXT NOT NULL,
    fulfilled INTEGER,
    timeOfDay TEXT NOT NULL,
    deliveryTimings TEXT,
    name TEXT NOT NULL,
    detail TEXT NOT NULL,
    estimatedDeliveryTime TEXT,
    spiceLevel INTEGER,
    type TEXT,
    ingredientSummary TEXT NOT NULL,
    image TEXT NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (dayId) REFERENCES ProductByDay(dayId)
);
`;

export const OrderedProductChoicesTableQuery = `
CREATE TABLE IF NOT EXISTS OrderedProductChoices (
    choiceId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    detail TEXT NOT NULL,
    productTimingId TEXT NOT NULL,
    FOREIGN KEY (productTimingId) REFERENCES ProductByTiming(productTimingId)
);
`;

export const OrderedProductExtraDippingTableQuery = `
CREATE TABLE IF NOT EXISTS OrderedProductExtraDipping (
    dippingId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    productTimingId TEXT NOT NULL,
    FOREIGN KEY (productTimingId) REFERENCES ProductByTiming(productTimingId)
);
`;

export const OrderedProductExtraToppingTableQuery = `
CREATE TABLE IF NOT EXISTS OrderedProductExtraTopping (
    toppingId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    productTimingId TEXT NOT NULL,
    FOREIGN KEY (productTimingId) REFERENCES ProductByTiming(productTimingId)
);
`;

export const OrderedProductSidesTableQuery = `
CREATE TABLE IF NOT EXISTS OrderedProductSides (
    sideId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    productTimingId TEXT NOT NULL,
    FOREIGN KEY (productTimingId) REFERENCES ProductByTiming(productTimingId)
);
`;

export const OrderedProductDessertTableQuery = `
CREATE TABLE IF NOT EXISTS OrderedProductDessert (
    dessertId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    productTimingId TEXT NOT NULL,
    FOREIGN KEY (productTimingId) REFERENCES ProductByTiming(productTimingId)
);
`;

export const OrderedProductDrinksTableQuery = `
CREATE TABLE IF NOT EXISTS OrderedProductDrinks (
    drinkId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    productTimingId TEXT NOT NULL,
    FOREIGN KEY (productTimingId) REFERENCES ProductByTiming(productTimingId)
);
`;