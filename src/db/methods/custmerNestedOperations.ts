// import { db } from '../Db';
// import { insertIntoTable } from './common';

// export async function insertOrUpdateCustomerProductOutline(outlineData: { outlineId: string, title: string, description: string, icon: string }): Promise<string> {
//     return new Promise((resolve, reject) => {
//         // First, check if there's any record in the table
//         const checkQuery = `SELECT * FROM CustomerProductOutline;`;
//         db.transaction(tx => {
//             tx.executeSql(
//                 checkQuery,
//                 [],
//                 (_, checkResult) => {
//                     if (checkResult.rows.length > 0) {
//                         // There's an existing record, update it
//                         const updateQuery = `UPDATE CustomerProductOutline SET outlineId = ?, title = ?, description = ?, icon = ?;`;
//                         tx.executeSql(
//                             updateQuery,
//                             [outlineData.outlineId, outlineData.title, outlineData.description, outlineData.icon],
//                             () => resolve('Outline updated successfully.'),
//                             (_, updateError) => {
//                                 console.error('Error updating CustomerProductOutline:', updateError);
//                                 reject(updateError);
//                                 return false;
//                             }
//                         );
//                     } else {
//                         // No record exists, insert new record
//                         const insertQuery = `INSERT INTO CustomerProductOutline (outlineId, title, description, icon) VALUES (?, ?, ?, ?);`;
//                         tx.executeSql(
//                             insertQuery,
//                             [outlineData.outlineId, outlineData.title, outlineData.description, outlineData.icon],
//                             () => resolve('Inserted new outline record.'),
//                             (_, insertError) => {
//                                 console.error('Error inserting into CustomerProductOutline:', insertError);
//                                 reject(insertError);
//                                 return false;
//                             }
//                         );
//                     }
//                 },
//                 (_, checkError) => {
//                     console.error('Error checking CustomerProductOutline:', checkError);
//                     reject(checkError);
//                     return false;
//                 }
//             );
//         });
//     });
// }

// export async function insertIntoCustomerDays(data: { dayId: string, day: string, deliveryDate: string }) {
//     return new Promise((resolve, reject) => {
//         const insertQuery = `INSERT INTO CustomerDays (dayId, day, deliveryDate) VALUES (?, ?, ?);`;
//         db.transaction(tx => {
//             tx.executeSql(
//                 insertQuery,
//                 [data.dayId, data.day, data.deliveryDate],
//                 () => resolve('Data inserted into CustomerDays'),
//                 (_, error) => {
//                     console.error('Error inserting into CustomerDays', error);
//                     reject(error);
//                     return false;
//                 }
//             );
//         });
//     });
// }

// export async function insertCustomerProductInclusion(inclusionData: { inclusionId: string, name: string, icon: string, outlineId: string }): Promise<string> {
//     const query = `INSERT INTO CustomerProductInclusion (inclusionId, name, icon, productInclusionId) VALUES (?, ?, ?, ?);`;
//     const values = [inclusionData.inclusionId, inclusionData.name, inclusionData.icon, inclusionData.outlineId];

//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 query,
//                 values,
//                 (_, result) => {
//                     // Check if insertId is available and is a number before calling toString on it
//                     if (typeof result.insertId === 'number') {
//                         resolve(result.insertId.toString());
//                     } else {
//                         // Since you're providing the inclusionId, resolve with it as insertion was successful
//                         resolve(inclusionData.inclusionId);
//                     }
//                 },
//                 (_, error) => {
//                     console.error('Error inserting data into CustomerProductInclusion', error);
//                     reject(error);
//                     return true;
//                 }
//             );
//         });
//     });
// }

// export async function getOrCreatePreferenceId(): Promise<string> {
//     return new Promise<string>((resolve, reject) => {
//         // Query to check if any entry exists in AnotherTable
//         const query = `SELECT preferenceId FROM Preference LIMIT 1;`;
//         db.transaction(tx => {
//             tx.executeSql(
//                 query,
//                 [],
//                 (_, { rows }) => {
//                     if (rows.length > 0) {
//                         resolve(rows.item(0).preferenceId);
//                     } else {
//                         insertPreference().then(resolve).catch(reject);
//                     }
//                 },
//                 (_, error) => {
//                     console.error('Error checking Preference', error);
//                     reject(error);
//                     return false;
//                 }
//             );
//         });
//     });
// }

// export async function insertPreference(): Promise<string> {
//     try {
//         const preferenceId: string = new Date().toISOString();
//         const query: string = `INSERT INTO Preference (preferenceId) VALUES (?);`;

//         return new Promise<string>((resolve, reject) => {
//             db.transaction(tx => {
//                 tx.executeSql(
//                     query,
//                     [preferenceId],
//                     () => resolve(preferenceId),
//                     (_, error) => {
//                         console.error('Error inserting data into Preference', error);
//                         reject(error);
//                         return false;
//                     }
//                 );
//             });
//         });
//     } catch (error) {
//         console.error('Error in insertPreference method:', error);
//         throw error;
//     }
// }

// export async function insertPreferredCategory(categoryData: { categoryId: string; categoryName: string; }) {
//     try {
//         const preferenceId = await getOrCreatePreferenceId();
//         const dataWithForeignKey = { ...categoryData, preferenceId: preferenceId };
//         return insertIntoTable('PreferredCategories', dataWithForeignKey);
//     } catch (error) {
//         console.error('Error inserting PreferredCategory data:', error);
//         throw error;
//     }
// }

// export async function insertPreferredSubCategory(subCategoryData: { subCategoryId: string; subCategoryName: string; }) {
//     try {
//         const preferenceId = await getOrCreatePreferenceId();
//         const dataWithForeignKey = { ...subCategoryData, preferenceId: preferenceId };
//         return insertIntoTable('PreferredSubCategories', dataWithForeignKey);
//     } catch (error) {
//         console.error('Error inserting PreferredSubCategory data:', error);
//         throw error;
//     }
// }

// export async function insertOrUpdateCustomerPackage(packageData: {
//     packageId: string;
//     packageName?: string | null;
//     totalNumberOfMeals?: number | null;
//     numberOfDays?: number | null;
//     timings?: number | null;
//     numberOfWeeks?: number | null;
// }) {
//     const checkQuery = `SELECT packageId FROM CustomerPackage WHERE packageId = ?;`;

//     return new Promise((resolve, reject) => {
//         db.transaction(tx => {
//             tx.executeSql(
//                 checkQuery,
//                 [packageData.packageId],
//                 (_, { rows }) => {
//                     const dataWithNulls = {
//                         ...packageData,
//                         packageName: packageData.packageName ?? null,
//                         totalNumberOfMeals: packageData.totalNumberOfMeals ?? null,
//                         numberOfDays: packageData.numberOfDays ?? null,
//                         timings: packageData.timings ?? null,
//                         numberOfWeeks: packageData.numberOfWeeks ?? null
//                     };
//                     if (rows.length > 0) {
//                         // Package exists, update it
//                         let updateQuery = `UPDATE CustomerPackage SET `;
//                         const queryParams = [];

//                         if (packageData.timings !== undefined) {
//                             updateQuery += `timings = ?, `;
//                             queryParams.push(dataWithNulls.timings);
//                         }
//                         if (packageData.numberOfDays !== undefined) {
//                             updateQuery += `numberOfDays = ?, `;
//                             queryParams.push(dataWithNulls.numberOfDays);
//                         }
//                         if (packageData.numberOfWeeks !== undefined) {
//                             updateQuery += `numberOfWeeks = ?, `;
//                             queryParams.push(dataWithNulls.numberOfWeeks);
//                         }
//                         if (packageData.packageName !== undefined) {
//                             updateQuery += `packageName = ?, `;
//                             queryParams.push(dataWithNulls.packageName);
//                         }
//                         if (packageData.totalNumberOfMeals !== undefined) {
//                             updateQuery += `totalNumberOfMeals = ?, `;
//                             queryParams.push(dataWithNulls.totalNumberOfMeals);
//                         }

//                         // Remove trailing comma and add WHERE clause
//                         updateQuery = updateQuery.slice(0, -2) + ` WHERE packageId = ?;`;
//                         queryParams.push(packageData.packageId);

//                         console.log("Package data inside function:", dataWithNulls);

//                         tx.executeSql(
//                             updateQuery,
//                             queryParams,
//                             () => {
//                                 // Log updated row for debugging
//                                 tx.executeSql(
//                                     `SELECT * FROM CustomerPackage WHERE packageId = ?;`,
//                                     [packageData.packageId],
//                                     (_, result) => {
//                                         console.log("Updated row:", result.rows.item(0));
//                                         resolve('Updated');
//                                     },
//                                     (_, error) => {
//                                         console.error("Error fetching updated row", error);
//                                         reject(error);
//                                         return false; 
//                                     }
//                                 );
//                             },
//                             (_, error) => {
//                                 console.error('Error updating CustomerPackage', error);
//                                 reject(error);
//                                 return false;
//                             }
//                         );
//                     } else {
//                         // Package doesn't exist, insert it
//                         const insertQuery = `INSERT INTO CustomerPackage (packageId, packageName, totalNumberOfMeals, numberOfDays, timings, numberOfWeeks) VALUES (?, ?, ?, ?, ?, ?);`;
//                         const insertParams = [dataWithNulls.packageId, dataWithNulls.packageName, dataWithNulls.totalNumberOfMeals, dataWithNulls.numberOfDays, dataWithNulls.timings, dataWithNulls.numberOfWeeks];
//                         tx.executeSql(
//                             insertQuery,
//                             insertParams,
//                             () => resolve('Inserted'),
//                             (_, error) => {
//                                 console.error('Error inserting into CustomerPackage', error);
//                                 reject(error);
//                                 return false;
//                             }
//                         );
//                     }
//                 },
//                 (_, error) => {
//                     console.error('Error checking CustomerPackage', error);
//                     reject(error);
//                     return false;
//                 }
//             );
//         });
//     });
// }

// export async function insertOrUpdateCustomerPayment(paymentData: { paymentType: string, orderType: string }) {
//     return new Promise((resolve, reject) => {
//         const checkQuery = `SELECT paymentType FROM CustomerPayment WHERE paymentType = ?;`;
//         db.transaction(tx => {
//             tx.executeSql(
//                 checkQuery,
//                 [paymentData.paymentType],
//                 (_, checkResult) => {
//                     if (checkResult.rows.length > 0) {
//                         // Update existing record
//                         const updateQuery = `UPDATE CustomerPayment SET orderType = ? WHERE paymentType = ?;`;
//                         tx.executeSql(
//                             updateQuery,
//                             [paymentData.orderType, paymentData.paymentType],
//                             () => resolve('Updated existing payment record.'),
//                             (_, updateError) => {
//                                 console.error('Error updating CustomerPayment:', updateError);
//                                 reject(updateError);
//                                 return false;
//                             }
//                         );
//                     } else {
//                         // Insert new record
//                         const insertQuery = `INSERT INTO CustomerPayment (paymentType, orderType) VALUES (?, ?);`;
//                         tx.executeSql(
//                             insertQuery,
//                             [paymentData.paymentType, paymentData.orderType],
//                             () => resolve('Inserted new payment record.'),
//                             (_, insertError) => {
//                                 console.error('Error inserting into CustomerPayment:', insertError);
//                                 reject(insertError);
//                                 return false;
//                             }
//                         );
//                     }
//                 },
//                 (_, checkError) => {
//                     console.error('Error checking CustomerPayment:', checkError);
//                     reject(checkError);
//                     return false;
//                 }
//             );
//         });
//     });
// }

// export async function insertCustomerPromo(promoData: { promoId: string, type: string, name: string, percent: string }) {
//     return new Promise((resolve, reject) => {
//         const checkQuery = `SELECT * FROM CustomerPromo WHERE type = ? AND name = ? AND percent = ?;`;
//         db.transaction(tx => {
//             tx.executeSql(
//                 checkQuery,
//                 [promoData.type, promoData.name, promoData.percent],
//                 (_, checkResult) => {
//                     if (checkResult.rows.length > 0) {
//                         // Promo already exists with the same details
//                         resolve('Promo already exists with the same details.');
//                     } else {
//                         // Insert new promo as it does not exist
//                         const insertQuery = `INSERT INTO CustomerPromo (type, name, percent) VALUES (?, ?, ?);`;
//                         tx.executeSql(
//                             insertQuery,
//                             [promoData.type, promoData.name, promoData.percent],
//                             () => resolve('Inserted new promo record.'),
//                             (_, insertError) => {
//                                 console.error('Error inserting into CustomerPromo:', insertError);
//                                 reject(insertError);
//                                 return false;
//                             }
//                         );
//                     }
//                 },
//                 (_, checkError) => {
//                     console.error('Error checking CustomerPromo:', checkError);
//                     reject(checkError);
//                     return false;
//                 }
//             );
//         });
//     });
// }

// export async function insertCustomerDevice(deviceData: { deviceId: string, isActive: boolean }) {
//     return new Promise((resolve, reject) => {
//         const checkQuery = `SELECT deviceId FROM CustomerDevice WHERE deviceId = ?;`;
//         db.transaction(tx => {
//             tx.executeSql(
//                 checkQuery,
//                 [deviceData.deviceId],
//                 (_, checkResult) => {
//                     if (checkResult.rows.length > 0) {
//                         // Already exists, so you might update or reject based on your logic
//                         resolve('Device already exists.');
//                     } else {
//                         // Convert boolean to number (1 for true, 0 for false)
//                         const isActiveNumeric = deviceData.isActive ? 1 : 0;

//                         // Insert new record
//                         const insertQuery = `INSERT INTO CustomerDevice (deviceId, isActive) VALUES (?, ?);`;
//                         tx.executeSql(
//                             insertQuery,
//                             [deviceData.deviceId, isActiveNumeric],
//                             () => resolve('Inserted new device record.'),
//                             (_, insertError) => {
//                                 console.error('Error inserting into CustomerDevice:', insertError);
//                                 reject(insertError);
//                                 return false;
//                             }
//                         );
//                     }
//                 },
//                 (_, checkError) => {
//                     console.error('Error checking CustomerDevice:', checkError);
//                     reject(checkError);
//                     return false;
//                 }
//             );
//         });
//     });
// }

// export async function insertCustomerPassword(passwordData: { hash: string, password: string }) {
//     return new Promise((resolve, reject) => {
//         const checkQuery = `SELECT hash FROM CustomerPassword WHERE hash = ?;`;
//         db.transaction(tx => {
//             tx.executeSql(
//                 checkQuery,
//                 [passwordData.hash],
//                 (_, checkResult) => {
//                     if (checkResult.rows.length > 0) {
//                         // Already exists, so you might update or reject based on your logic
//                         resolve('Password already exists.');
//                     } else {
//                         // Insert new record
//                         const insertQuery = `INSERT INTO CustomerPassword (hash, password) VALUES (?, ?);`;
//                         tx.executeSql(
//                             insertQuery,
//                             [passwordData.hash, passwordData.password],
//                             () => resolve('Inserted new password record.'),
//                             (_, insertError) => {
//                                 console.error('Error inserting into CustomerPassword:', insertError);
//                                 reject(insertError);
//                                 return false;
//                             }
//                         );
//                     }
//                 },
//                 (_, checkError) => {
//                     console.error('Error checking CustomerPassword:', checkError);
//                     reject(checkError);
//                     return false;
//                 }
//             );
//         });
//     });
// }
