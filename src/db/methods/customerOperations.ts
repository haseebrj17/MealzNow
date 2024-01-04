import { db } from "../Db";
import { insertIntoTable } from "./common";

export async function insertCustomer(customerData: {
    _id: string,
    type: string,
    fullName: string,
    emailAddress: string,
    contactNumber: string,
    password: string,
    isNumberVerified: boolean,
    isEmailVerified: boolean,
    cityId?: string,
    preferenceId?: string,
    customerProductOutlineId?: string,
    customerPackageId?: string,
    customerPromoId?: string,
    customerPaymentId?: string,
    customerPasswordId?: string,
    customerDeviceId?: string
}): Promise<void> {
    try {
        // You would need to verify or add foreign keys for all optional IDs
        if (customerData.preferenceId) {
            await verifyOrAddForeignKey('Preference', customerData.preferenceId);
        }
        // Repeat for other optional foreign keys...

        // Insert data into Customer table
        await insertIntoTable('Customer', customerData);
    } catch (error) {
        console.error('Error inserting data into Customer:', error);
        throw error;
    }
}

// This function checks if the foreign key exists in the given table, and if not, it adds a default entry.
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

// Get the primary key column name for a table.
function getPrimaryKeyForTable(tableName: string): string | null {
    // Map the table name to its primary key
    const primaryKeyMap: { [key: string]: string } = {
        'Customer': '_id',
        'CustomerAddress': 'addressId',
        'Franchise': 'franchiseId',
        // Add more mappings as needed
    };

    return primaryKeyMap[tableName] || null;
}

// Check if a row with the given ID exists in the table.
async function checkForeignKeyExists(tableName: string, primaryKey: string, id: string): Promise<boolean> {
    const query = `SELECT ${primaryKey} FROM ${tableName} WHERE ${primaryKey} = ?;`;
    return new Promise<boolean>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                query,
                [id],
                (_, result) => resolve(result.rows.length > 0),
                (_, error) => {
                    console.error(`Error checking for ID in ${tableName}:`, error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

// Add a default entry for a foreign key in the given table.
async function addForeignKeyEntry(tableName: string, primaryKey: string, id: string): Promise<void> {
    const defaultData: { [key: string]: any } = {
        // Add default data for each table
        'Customer': { [primaryKey]: id, /* other fields */ },
        'CustomerAddress': { [primaryKey]: id, /* other fields */ },
        'Franchise': { [primaryKey]: id, /* other fields */ },
        // Add more default data as needed
    };

    if (defaultData[tableName]) {
        await insertIntoTable(tableName, defaultData[tableName]);
    } else {
        // If there's no default data defined for the table, you might want to throw an error or handle it in some way.
        throw new Error(`No default data provided for table ${tableName}`);
    }
}
