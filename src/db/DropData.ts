import { db } from "./Db";

const tables = [
    'Customer',
    'CustomerPackage',
    'CustomerPayment',
    'CustomerPromo',
    'CustomerDevice',
    'CustomerPassword',
    'Preference',
    'CustomerProductOutline',
    'CustomerProductInclusion',
    'PreferredCategories',
    'PreferredSubCategories',
    'Cart',
    'CustomerOrderedPackage',
    'CustomerOrderPromo',
    'CustomerOrderPayment',
    'ProductByDay',
    'ProductByTiming',
    'OrderedProductChoices',
    'OrderedProductExtraDipping',
    'OrderedProductExtraTopping',
    'OrderedProductSides',
    'OrderedProductDessert',
    'OrderedProductDrinks',
];

export const dropAllTables = async () => {
    try {
        db.transaction(tx => {
            tables.forEach(tableName => {
                tx.executeSql(
                    `DROP TABLE IF EXISTS ${tableName};`,
                    [],
                    () => {
                        console.log(`Dropped table: ${tableName}`);
                    }
                );
            });
        }, (error) => {
            console.error('Transaction error:', error);
        }, () => {
            console.log('All tables dropped successfully');
        });
    } catch (error) {
        console.error('Error in dropAllTables function:', error);
    }
};