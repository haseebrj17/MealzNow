import { db } from "../Db";
import { insertIntoTable } from "./common";

export async function insertOrUpdateCustomerOrderedPackage(packageData: {
    packageId: string;
    packageName?: string | null;
    totalNumberOfMeals?: number | null;
    numberOfDays?: number | null;
    timings?: number | null;
    numberOfWeeks?: number | null;
}) {
    const checkQuery = `SELECT packageId FROM CustomerOrderedPackage WHERE packageId = ?;`;

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                checkQuery,
                [packageData.packageId],
                (_, { rows }) => {
                    const dataWithNulls = {
                        ...packageData,
                        packageName: packageData.packageName ?? null,
                        totalNumberOfMeals: packageData.totalNumberOfMeals ?? null,
                        numberOfDays: packageData.numberOfDays ?? null,
                        timings: packageData.timings ?? null,
                        numberOfWeeks: packageData.numberOfWeeks ?? null
                    };
                    if (rows.length > 0) {
                        // Ordered package exists, update it
                        let updateQuery = `UPDATE CustomerOrderedPackage SET `;
                        const queryParams = [];

                        if (packageData.timings !== undefined) {
                            updateQuery += `timings = ?, `;
                            queryParams.push(dataWithNulls.timings);
                        }
                        if (packageData.numberOfDays !== undefined) {
                            updateQuery += `numberOfDays = ?, `;
                            queryParams.push(dataWithNulls.numberOfDays);
                        }
                        if (packageData.numberOfWeeks !== undefined) {
                            updateQuery += `numberOfWeeks = ?, `;
                            queryParams.push(dataWithNulls.numberOfWeeks);
                        }
                        if (packageData.packageName !== undefined) {
                            updateQuery += `packageName = ?, `;
                            queryParams.push(dataWithNulls.packageName);
                        }
                        if (packageData.totalNumberOfMeals !== undefined) {
                            updateQuery += `totalNumberOfMeals = ?, `;
                            queryParams.push(dataWithNulls.totalNumberOfMeals);
                        }

                        // Remove trailing comma and add WHERE clause
                        updateQuery = updateQuery.slice(0, -2) + ` WHERE packageId = ?;`;
                        queryParams.push(packageData.packageId);

                        tx.executeSql(
                            updateQuery,
                            queryParams,
                            () => resolve('Updated'),
                            (_, error) => {
                                console.error('Error updating CustomerOrderedPackage', error);
                                reject(error);
                                return false;
                            }
                        );
                    } else {
                        // Ordered package doesn't exist, insert it
                        const insertQuery = `INSERT INTO CustomerOrderedPackage (packageId, packageName, totalNumberOfMeals, numberOfDays, timings, numberOfWeeks) VALUES (?, ?, ?, ?, ?, ?);`;
                        const insertParams = [dataWithNulls.packageId, dataWithNulls.packageName, dataWithNulls.totalNumberOfMeals, dataWithNulls.numberOfDays, dataWithNulls.timings, dataWithNulls.numberOfWeeks];
                        tx.executeSql(
                            insertQuery,
                            insertParams,
                            () => resolve('Inserted'),
                            (_, error) => {
                                console.error('Error inserting into CustomerOrderedPackage', error);
                                reject(error);
                                return false;
                            }
                        );
                    }
                },
                (_, error) => {
                    console.error('Error checking CustomerOrderedPackage', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function insertIntoCustomerOrderDays(data: { dayId: string, day: string, deliveryDate: string }) {
    return new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO CustomerOrderDays (dayId, day, deliveryDate) VALUES (?, ?, ?);`;
        db.transaction(tx => {
            tx.executeSql(
                insertQuery,
                [data.dayId, data.day, data.deliveryDate],
                () => resolve('Data inserted into CustomerOrderDays'),
                (_, error) => {
                    console.error('Error inserting into CustomerOrderDays', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function insertCustomerOrderPromo(promoData: { type: string, name: string, percent: string }) {
    return new Promise((resolve, reject) => {
        // Check for existing promo with the same details
        const checkQuery = `SELECT * FROM CustomerOrderPromo WHERE type = ? AND name = ? AND percent = ?;`;
        db.transaction(tx => {
            tx.executeSql(
                checkQuery,
                [promoData.type, promoData.name, promoData.percent],
                (_, checkResult) => {
                    if (checkResult.rows.length > 0) {
                        // Promo with the same details exists
                        resolve('Order promo with these details already exists.');
                    } else {
                        // Insert new promo as it does not exist
                        const insertQuery = `INSERT INTO CustomerOrderPromo (type, name, percent) VALUES (?, ?, ?);`;
                        tx.executeSql(
                            insertQuery,
                            [promoData.type, promoData.name, promoData.percent],
                            () => resolve('Inserted new order promo record.'),
                            (_, insertError) => {
                                console.error('Error inserting into CustomerOrderPromo:', insertError);
                                reject(insertError);
                                return false;
                            }
                        );
                    }
                },
                (_, checkError) => {
                    console.error('Error checking CustomerOrderPromo:', checkError);
                    reject(checkError);
                    return false;
                }
            );
        });
    });
}

export async function insertCustomerOrderPayment(paymentData: { paymentType: string, orderType: string }) {
    return new Promise((resolve, reject) => {
        const checkQuery = `SELECT COUNT(*) AS count FROM CustomerOrderPayment;`;
        db.transaction(tx => {
            tx.executeSql(
                checkQuery,
                [],
                (_, checkResult) => {
                    if (checkResult.rows.item(0).count > 0) {
                        // Payment already exists
                        resolve('Order payment already exists.');
                    } else {
                        // Insert new payment
                        return insertIntoTable('CustomerOrderPayment', paymentData);
                    }
                },
                (_, checkError) => {
                    console.error('Error checking CustomerOrderPayment:', checkError);
                    reject(checkError);
                    return false;
                }
            );
        });
    });
}

export async function insertProductByDay(dayData: { dayId: string, day: string, deliveryDate: string, orderId: string }) {
    return insertIntoTable('ProductByDay', dayData);
}

export async function getOrCreateOrderId(): Promise<string> {
    const selectQuery = `SELECT orderId FROM Cart LIMIT 1;`;

    try {
        const existingOrderId = await new Promise<string>((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    selectQuery,
                    [],
                    (_, { rows }) => {
                        if (rows.length > 0) {
                            resolve(rows.item(0).orderId);
                        } else {
                            resolve('');
                        }
                    },
                    (_, error) => {
                        console.error('Error checking for orderId in Cart:', error);
                        reject(error);
                        return false;
                    }
                );
            });
        });

        if (existingOrderId) {
            return existingOrderId;
        } else {
            const newOrderId = new Date().toISOString();
            const newOrderData = {
                orderId: newOrderId,
            };
            await insertIntoTable('Cart', newOrderData);
            return newOrderId;
        }
    } catch (error) {
        console.error('Error in getOrCreateOrderId:', error);
        throw error;
    }
}

export async function createNewDayAndGetId(): Promise<string> {
    // Generate a new dayId
    const dayId = `day_${new Date().getTime()}`;

    // Default values for day and deliveryDate
    const day = 'New Day'; // Replace with actual logic
    const deliveryDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    const orderId = await getOrCreateOrderId();

    const newDayData = {
        dayId,
        day,
        deliveryDate,
        orderId
    };

    await insertIntoTable('ProductByDay', newDayData);

    return dayId;
}

export async function insertProductByTiming(timingData: { productTimingId: string, dayId?: string, timeOfDayId: string, fulfilled: number, timeOfDay: string, deliveryTimings: string, name: string, detail: string, estimatedDeliveryTime?: string, spiceLevel?: number, type?: string, ingredientSummary: string, image: string, price: number }) {
    try {
        const dayId = await createNewDayAndGetId();
        const fullTimingData = { ...timingData, dayId };
        return insertIntoTable('ProductByTiming', fullTimingData);
    } catch (error) {
        console.error('Error inserting data into ProductByTiming:', error);
        throw error;
    }
}

export async function checkDayIdExists(dayId: string): Promise<boolean> {
    const query = `SELECT dayId FROM ProductByDay WHERE dayId = ?;`;
    return new Promise<boolean>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                query,
                [dayId],
                (_, { rows }) => resolve(rows.length > 0),
                (_, error) => {
                    console.error('Error checking for dayId in ProductByDay:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function insertProductDetail(tableName: string, data: any) {
    try {
        const productTimingExists = await checkProductTimingIdExists(data.productTimingId);
        if (!productTimingExists) {
            throw new Error(`ProductTimingId ${data.productTimingId} does not exist in ProductByTiming table.`);
        }

        // Generate the correct ID key based on the table name
        const idKey = `${tableName.slice(8, -1).toLowerCase()}Id`;
        if (!data[idKey]) {
            throw new Error(`ID key ${idKey} is missing in the data.`);
        }

        const query = `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(() => '?').join(', ')});`;

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    query,
                    Object.values(data),
                    (_, result) => resolve(result),
                    (_, error) => {
                        console.error(`Error inserting data into ${tableName}`, error);
                        reject(error);
                        return false;
                    }
                );
            });
        });
    } catch (error) {
        console.error(`Error in insertProductDetail for ${tableName}:`, error);
        throw error;
    }
}

export async function checkProductTimingIdExists(productTimingId: string): Promise<boolean> {
    const query = `SELECT productTimingId FROM ProductByTiming WHERE productTimingId = ?;`;
    return new Promise<boolean>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                query,
                [productTimingId],
                (_, { rows }) => resolve(rows.length > 0),
                (_, error) => {
                    console.error('Error checking for productTimingId in ProductByTiming:', error);
                    reject(error);
                    return false;
                }
            );
        });
    });
}

export async function insertOrderedProductChoice(choiceData: { choiceId: string, name: string, detail: string, productTimingId: string }) {
    const checkQuery = `SELECT COUNT(*) AS count FROM OrderedProductChoices WHERE productTimingId = ?;`;
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                checkQuery,
                [choiceData.productTimingId],
                (_, checkResult) => {
                    if (checkResult.rows.item(0).count > 0) {
                        // Record for this productTimingId already exists
                        resolve('Choice for this timing already exists.');
                    } else {
                        // Insert new choice record
                        return insertProductDetail('OrderedProductChoices', choiceData);
                    }
                },
                (_, checkError) => {
                    console.error('Error checking OrderedProductChoices:', checkError);
                    reject(checkError);
                    return false;
                }
            );
        });
    });
}

export async function insertOrderedProductExtraDipping(dippingData: { dippingId: string, name: string, price: number, productTimingId: string }) {
    return insertProductDetail('OrderedProductExtraDipping', dippingData);
}

export async function insertOrderedProductExtraTopping(toppingData: { toppingId: string, name: string, price: number, productTimingId: string }) {
    return insertProductDetail('OrderedProductExtraTopping', toppingData);
}

export async function insertOrderedProductSides(sideData: { sideId: string, name: string, price: number, productTimingId: string }) {
    return insertProductDetail('OrderedProductSides', sideData);
}

export async function insertOrderedProductDessert(dessertData: { dessertId: string, name: string, price: number, productTimingId: string }) {
    const checkQuery = `SELECT COUNT(*) AS count FROM OrderedProductDessert WHERE productTimingId = ?;`;
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                checkQuery,
                [dessertData.productTimingId],
                (_, checkResult) => {
                    if (checkResult.rows.item(0).count > 0) {
                        // Record for this productTimingId already exists
                        resolve('Dessert for this timing already exists.');
                    } else {
                        // Insert new dessert record
                        return insertProductDetail('OrderedProductDessert', dessertData);
                    }
                },
                (_, checkError) => {
                    console.error('Error checking OrderedProductDessert:', checkError);
                    reject(checkError);
                    return false;
                }
            );
        });
    });
}

export async function insertOrderedProductDrinks(drinkData: { drinkId: string, name: string, price: number, productTimingId: string }) {
    const checkQuery = `SELECT COUNT(*) AS count FROM OrderedProductDrinks WHERE productTimingId = ?;`;
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                checkQuery,
                [drinkData.productTimingId],
                (_, checkResult) => {
                    if (checkResult.rows.item(0).count > 0) {
                        // Record for this productTimingId already exists
                        resolve('Drink for this timing already exists.');
                    } else {
                        // Insert new drink record
                        return insertProductDetail('OrderedProductDrinks', drinkData);
                    }
                },
                (_, checkError) => {
                    console.error('Error checking OrderedProductDrinks:', checkError);
                    reject(checkError);
                    return false;
                }
            );
        });
    });
}