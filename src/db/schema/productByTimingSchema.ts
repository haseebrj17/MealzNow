import * as yup from 'yup';
import {
    OrderedProductChoices,
    OrderedProductDessert,
    OrderedProductDrinks,
    OrderedProductExtraDipping,
    OrderedProductExtraTopping,
    OrderedProductSides,
    orderedProductChoicesSchema,
    orderedProductDessertSchema,
    orderedProductDrinksSchema,
    orderedProductExtraDippingSchema,
    orderedProductExtraToppingSchema,
    orderedProductSidesSchema
} from './productByTimingNestedSchema';

export interface ProductByTiming {
    timeOfDay?: string,
    timeOfDayId?: string,
    deliveryTimings?: Date,
    deliveryTimingsId?: string,
    name?: string,
    detail?: string,
    estimatedDeliveryTime?: string,
    spiceLevel?: string,
    type?: string,
    ingredientSummary?: string,
    image?: string,
    price?: number,
    orderedProductExtraDippings?: OrderedProductExtraDipping[],
    orderedProductExtraToppings?: OrderedProductExtraTopping[],
    orderedProductSides?: OrderedProductSides[],
    orderedProductDesserts?: OrderedProductDessert[],
    orderedProductDrinks?: OrderedProductDrinks[],
    orderedProductChoices?: OrderedProductChoices[],
}

export const productByTimingSchema = yup.object().shape({
    timeOfDay: yup.string().required(),
    timeOfDayId: yup.string().required(),
    deliveryTimings: yup.date().required(),
    deliveryTimingsId: yup.string().required(),
    name: yup.string().required(),
    detail: yup.string().required(),
    estimatedDeliveryTime: yup.string().required(),
    spiceLevel: yup.string(),
    type: yup.string(),
    ingredientSummary: yup.string().required(),
    image: yup.string().required(),
    price: yup.number().required(),
    orderedProductExtraDippings: yup.array().of(orderedProductExtraDippingSchema),
    orderedProductExtraToppings: yup.array().of(orderedProductExtraToppingSchema),
    orderedProductSides: yup.array().of(orderedProductSidesSchema),
    orderedProductDesserts: yup.array().of(orderedProductDessertSchema),
    orderedProductDrinks: yup.array().of(orderedProductDrinksSchema),
    orderedProductChoices: yup.array().of(orderedProductChoicesSchema),
});