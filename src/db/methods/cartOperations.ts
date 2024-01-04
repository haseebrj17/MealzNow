import { db } from "../Db";
import { insertIntoTable } from "./common";

export async function insertIntoCart(cartData: { orderId: string, totalBill: number, totalItems: number, orderDeliveryDateTime: string, instructions?: string, customerId: string, customerAddressId: string, franchiseId: string, customerOrderedPackageId: string, customerOrderPromoId?: string, customerOrderPaymentId?: string }): Promise<void> {
    try {
        // Verify or add foreign keys
        await verifyOrAddForeignKey('Customer', cartData.customerId);
        await verifyOrAddForeignKey('CustomerAddress', cartData.customerAddressId);
        await verifyOrAddForeignKey('Franchise', cartData.franchiseId);
        await verifyOrAddForeignKey('CustomerOrderedPackage', cartData.customerOrderedPackageId);
        if (cartData.customerOrderPromoId) {
            await verifyOrAddForeignKey('CustomerOrderPromo', cartData.customerOrderPromoId);
        }
        if (cartData.customerOrderPaymentId) {
            await verifyOrAddForeignKey('CustomerOrderPayment', cartData.customerOrderPaymentId);
        }

        // Insert data into Cart table
        await insertIntoTable('Cart', cartData);
    } catch (error) {
        console.error('Error inserting data into Cart:', error);
        throw error;
    }
}

async function verifyOrAddForeignKey(tableName: string, foreignKeyId: string): Promise<void> {
    const primaryKey = getPrimaryKeyForTable(tableName);
    if (!primaryKey) {
        throw new Error(`Primary key for table ${tableName} is not defined`);
    }

    const exists = await checkForeignKeyExists(tableName, primaryKey, foreignKeyId);
    if (!exists) {
        await addForeignKeyEntry(tableName, primaryKey, foreignKeyId);
    }
}

function getPrimaryKeyForTable(tableName: string): string | null {
    switch (tableName) {
        case 'Customer':
            return '_id';
        case 'CustomerAddress':
            return 'addressId';
        case 'Franchise':
            return 'franchiseId';
        case 'CustomerOrderedPackage':
            return 'packageId';
        case 'CustomerOrderPromo':
            return 'promoId';
        case 'CustomerOrderPayment':
            return 'paymentId';
        default:
            return null;
    }
}

async function checkForeignKeyExists(tableName: string, primaryKey: string, id: string): Promise<boolean> {
    const query = `SELECT ${primaryKey} FROM ${tableName} WHERE ${primaryKey} = ?;`;
    return new Promise<boolean>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                query,
                [id],
                (_, { rows }) => resolve(rows.length > 0),
                (_, error) => {
                    console.error(`Error checking for ID in ${tableName}:`, error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

async function addForeignKeyEntry(tableName: string, primaryKey: string, id: string): Promise<void> {
    // You need to define how a new entry is added for each table.
    // This is a placeholder for your actual implementation.

    // Example for Customer table (adjust according to your schema)
    if (tableName === 'Customer') {
        await insertIntoTable(tableName, {
            [primaryKey]: id,
            // Add other necessary fields for a new Customer
        });
    }
    // Implement similar logic for other tables
}
