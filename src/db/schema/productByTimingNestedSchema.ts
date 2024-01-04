import * as yup from 'yup';

export interface OrderedProductChoices {
    name?: string,
    detail?: string
}

export interface OrderedProductExtraDipping {
    name?: string,
    price?: number
}

export interface OrderedProductExtraTopping {
    name?: string,
    price?: number
}

export interface OrderedProductSides {
    name?: string,
    price?: number,
    orderProductId?: string
}

export interface OrderedProductDessert {
    name?: string,
    price?: number
}

export interface OrderedProductDrinks {
    name?: string,
    price?: number
}

export const orderedProductChoicesSchema = yup.object().shape({
    name: yup.string().required(),
    detail: yup.string().required(),
});

export const orderedProductExtraDippingSchema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
});

export const orderedProductExtraToppingSchema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
});

export const orderedProductSidesSchema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
    orderProductId: yup.string().required(), // Assuming this is a string ID
});

export const orderedProductDessertSchema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
});

export const orderedProductDrinksSchema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
});