import Realm from "realm";
import {
    CustomerSchema,
    CartSchema,
    CustomerOrderedPackageSchema,
    CustomerOrderPromoSchema,
    CustomerOrderPaymentSchema,
    ProductByDaySchema,
    ProductByTimingSchema,
    OrderedProductExtraDippingSchema,
    OrderedProductExtraToppingSchema,
    OrderedProductSidesSchema,
    OrderedProductDessertSchema,
    OrderedProductDrinksSchema,
    OrderedProductChoicesSchema,
    PreferenceSchema,
    PreferredCategoriesSchema,
    PreferredSubCategoriesSchema,
    CustomerProductOutlineSchema,
    CustomerProductInclusionSchema,
    CustomerPackageSchema,
    CustomerPaymentSchema,
    CustomerPromoSchema,
    CustomerPasswordSchema,
    CustomerDeviceSchema
} from "./models";

const realmConfig = {
    schema: [
        CustomerSchema,
        CartSchema,
        CustomerOrderedPackageSchema,
        CustomerOrderPromoSchema,
        CustomerOrderPaymentSchema,
        ProductByDaySchema,
        ProductByTimingSchema,
        OrderedProductExtraDippingSchema,
        OrderedProductExtraToppingSchema,
        OrderedProductSidesSchema,
        OrderedProductDessertSchema,
        OrderedProductDrinksSchema,
        OrderedProductChoicesSchema,
        PreferenceSchema,
        PreferredCategoriesSchema,
        PreferredSubCategoriesSchema,
        CustomerProductOutlineSchema,
        CustomerProductInclusionSchema,
        CustomerPackageSchema,
        CustomerPaymentSchema,
        CustomerPromoSchema,
        CustomerPasswordSchema,
        CustomerDeviceSchema
    ],
    schemaVersion: 0,
};

async function initializeRealm() {
    try {
        // Realm.deleteFile(realmConfig);
        const realm = await Realm.open(
            realmConfig
        )
    } catch (error) {
        console.error("Error opening Realm: ", error);
    }
}

export default initializeRealm;