import * as SQLite from 'expo-sqlite';
import { Cart, cartSchema } from './schema/cartSchema';
import { Customer, customerSchema } from './schema/customerSchema';
import * as yup from 'yup';
import {
    CustomerPackageTableQuery,
    CustomerPaymentTableQuery,
    CustomerPromoTableQuery,
    CustomerDeviceTableQuery,
    CustomerPasswordTableQuery,
    PreferenceTableQuery,
    CustomerProductOutlineTableQuery,
    CustomerProductInclusionTableQuery,
    PreferredCategoriesTableQuery,
    PreferredSubCategoriesTableQuery,
    CartTableQuery,
    CustomerOrderedPackageTableQuery,
    CustomerOrderPromoTableQuery,
    CustomerOrderPaymentTableQuery,
    ProductByDayTableQuery,
    ProductByTimingTableQuery,
    OrderedProductChoicesTableQuery,
    OrderedProductExtraDippingTableQuery,
    OrderedProductExtraToppingTableQuery,
    OrderedProductSidesTableQuery,
    OrderedProductDessertTableQuery,
    OrderedProductDrinksTableQuery,
    CustomerTableQuery,
    CustomerOrderDaysTableQuery,
    CustomerDaysTableQuery
} from './models';

export const db = SQLite.openDatabase('MealzNowDb');

export const initializeDatabase = () => {
    db.transaction(tx => {
        tx.executeSql(
            CustomerTableQuery,
            [],
            () => console.log('Customer table created successfully'),
            (txObj, error) => {
                console.log('Error creating Customer table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerOrderDaysTableQuery,
            [],
            () => console.log('CustomerOrderDay table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerOrderDay table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerDaysTableQuery,
            [],
            () => console.log('CustomerDay table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerDay table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerPackageTableQuery,
            [],
            () => console.log('CustomerPackage table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPackage table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerPaymentTableQuery,
            [],
            () => console.log('CustomerPayment table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPayment table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerPromoTableQuery,
            [],
            () => console.log('CustomerPromo table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPromo table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerDeviceTableQuery,
            [],
            () => console.log('CustomerDevice table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerDevice table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerPasswordTableQuery,
            [],
            () => console.log('CustomerPassword table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPackage table', error);
                return false;
            }
        );

        tx.executeSql(
            PreferenceTableQuery,
            [],
            () => console.log('CustomerPrefernce table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPayment table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerProductOutlineTableQuery,
            [],
            () => console.log('CustomerProductOutline table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPromo table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerProductInclusionTableQuery,
            [],
            () => console.log('CustomerProductInclusion table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerDevice table', error);
                return false;
            }
        );

        tx.executeSql(
            PreferredCategoriesTableQuery,
            [],
            () => console.log('PreferredCategories table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPackage table', error);
                return false;
            }
        );

        tx.executeSql(
            PreferredSubCategoriesTableQuery,
            [],
            () => console.log('PreferredSubCategories table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerPayment table', error);
                return false;
            }
        );

        tx.executeSql(
            CartTableQuery,
            [],
            () => console.log('Cart table created successfully'),
            (txObj, error) => {
                console.log('Error creating Cart table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerOrderedPackageTableQuery,
            [],
            () => console.log('CustomerOrderedPackage table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerOrderedPackage table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerOrderPromoTableQuery,
            [],
            () => console.log('CustomerOrderPromo table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerOrderPromo table', error);
                return false;
            }
        );

        tx.executeSql(
            CustomerOrderPaymentTableQuery,
            [],
            () => console.log('CustomerOrderPayment table created successfully'),
            (txObj, error) => {
                console.log('Error creating CustomerOrderPayment table', error);
                return false;
            }
        );

        tx.executeSql(
            ProductByDayTableQuery,
            [],
            () => console.log('ProductByDay table created successfully'),
            (txObj, error) => {
                console.log('Error creating ProductByDay table', error);
                return false;
            }
        );

        tx.executeSql(
            ProductByTimingTableQuery,
            [],
            () => console.log('ProductByTiming table created successfully'),
            (txObj, error) => {
                console.log('Error creating ProductByTiming table', error);
                return false;
            }
        );

        tx.executeSql(
            OrderedProductChoicesTableQuery,
            [],
            () => console.log('OrderedProductChoices table created successfully'),
            (txObj, error) => {
                console.log('Error creating OrderedProductChoices table', error);
                return false;
            }
        );

        tx.executeSql(
            OrderedProductExtraDippingTableQuery,
            [],
            () => console.log('OrderedProductExtraDipping table created successfully'),
            (txObj, error) => {
                console.log('Error creating OrderedProductExtraDipping table', error);
                return false;
            }
        );

        tx.executeSql(
            OrderedProductExtraToppingTableQuery,
            [],
            () => console.log('OrderedProductExtraTopping table created successfully'),
            (txObj, error) => {
                console.log('Error creating OrderedProductExtraTopping table', error);
                return false;
            }
        );

        tx.executeSql(
            OrderedProductSidesTableQuery,
            [],
            () => console.log('OrderedProductSides table created successfully'),
            (txObj, error) => {
                console.log('Error creating OrderedProductSides table', error);
                return false;
            }
        );

        tx.executeSql(
            OrderedProductDessertTableQuery,
            [],
            () => console.log('OrderedProductDessert table created successfully'),
            (txObj, error) => {
                console.log('Error creating OrderedProductDessert table', error);
                return false;
            }
        );

        tx.executeSql(
            OrderedProductDrinksTableQuery,
            [],
            () => console.log('OrderedProductDrinks table created successfully'),
            (txObj, error) => {
                console.log('Error creating OrderedProductDrinks table', error);
                return false;
            }
        );

    },
        (error) => {
            console.log('Transaction error:', error);
        },
        () => {
            console.log('Transaction completed successfully');
        });
}