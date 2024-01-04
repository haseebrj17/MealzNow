import { db } from "./Db";


const tableNames = [
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

export const logAllTables = () => {
    db.transaction(tx => {
        tableNames.forEach(tableName => {
            tx.executeSql(
                `SELECT * FROM ${tableName};`,
                [],
                (_, { rows }) => {
                    console.log(`=== ${tableName} ===`);
                    for (let i = 0; i < rows.length; i++) {
                        console.log(rows.item(i));
                    }
                },
                (_, error) => {
                    console.log(`Error querying ${tableName}:`, error);
                    return false;
                }
            );
        });
    },
        error => console.log('Transaction error:', error),
        () => console.log('Transaction completed successfully')
    );
};
