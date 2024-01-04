import { db } from '../Db';

export async function insertIntoTable(tableName: string, data: any) {
    const columns = Object.keys(data).join(', ');
    const values: any = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders});`;

    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    query,
                    values,
                    (_, result) => resolve(result),
                );
            });
        });
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
}

export async function updateTable(tableName: string, data: any, whereClause: string, whereArgs: any[]): Promise<void> {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...whereArgs];

    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause};`;

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                query,
                values,
                () => resolve(),
                (_, error) => {
                    console.error(`Error updating ${tableName}:`, error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function deleteFromTable(tableName: string, whereClause: string, whereArgs: any[]): Promise<void> {
    const query = `DELETE FROM ${tableName} WHERE ${whereClause};`;

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                query,
                whereArgs,
                () => resolve(),
                (_, error) => {
                    console.error(`Error deleting from ${tableName}:`, error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function getDataFromTable(tableName: string, columns: string[], whereClause: string = '', whereArgs: any[] = []): Promise<any[]> {
    const query = `SELECT ${columns.join(', ')} FROM ${tableName}` + (whereClause ? ` WHERE ${whereClause}` : '') + ';';

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                query,
                whereArgs,
                (_, result) => {
                    const data = [];
                    for (let i = 0; i < result.rows.length; i++) {
                        data.push(result.rows.item(i));
                    }
                    resolve(data);
                },
                (_, error) => {
                    console.error(`Error retrieving data from ${tableName}:`, error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}


/**
 * Example usage:
 *
 * Update Example
 * @param {string} tableName - The name of the table to update.
 * @param {object} data - The data to update in the table.
 * @param {string} whereClause - The WHERE clause for the update query.
 * @param {any[]} whereArgs - The arguments for the WHERE clause.
updateTable('Customer', { fullName: 'John Doe', contactNumber: '1234567890' }, 'customerId = ?', ['123']).then(() => {
    console.log('Customer updated successfully');
}).catch(error => {
    console.error('Error updating customer:', error);
});
*/

/**
 * Delete Example
 * @param {string} tableName - The name of the table to delete from.
 * @param {string} whereClause - The WHERE clause for the delete query.
 * @param {any[]} whereArgs - The arguments for the WHERE clause.
deleteFromTable('Customer', 'customerId = ?', ['123']).then(() => {
    console.log('Customer deleted successfully');
}).catch(error => {
    console.error('Error deleting customer:', error);
});
*/

/**
 * Retrieve Data Example
 * @param {string} tableName - The name of the table to retrieve data from.
 * @param {string[]} columns - The columns to retrieve from the table.
 * @param {string} whereClause - The WHERE clause for the select query.
 * @param {any[]} whereArgs - The arguments for the WHERE clause.
getDataFromTable('Customer', ['fullName', 'contactNumber'], 'customerId = ?', ['123']).then(data => {
    console.log('Customer data:', data);
}).catch(error => {
    console.error('Error retrieving customer data:', error);
});
*/
