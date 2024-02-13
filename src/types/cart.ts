
export interface Cart {
    _id: string;
    type: string;
    totalBill: number;
    totalItems: number;
    orderDeliveryDateTime: string;
    instructions?: string;
    customerId: string;
    customerAddressId: string;
    franchiseId: string;
    customerOrderedPackage?: CustomerOrderedPackage;
    productByDay: ProductByDay[];
    customerOrderPromo?: CustomerOrderPromo;
    customerOrderPayment: CustomerOrderPayment;
}

export interface CustomerOrderedPackage {
    packageId?: string;
    packageName?: string;
    timings: number;
    totalNumberOfMeals?: number;
    numberOfDays?: number;
    numberOfWeeks?: number;
    mealzPerDay?: string;
}

export interface CustomerOrderPromo {
    type?: string;
    name?: string;
    percent?: string;
}

export interface CustomerOrderPayment {
    paymentType?: string;
    orderType?: string;
}

export interface ProductByDay {
    day: string;
    dayId: string;
    deliveryDate: string;
    productByTiming: ProductByTiming[];
}

export interface OrderedProductChoices {
    name?: string,
    detail?: string
}

export interface OrderedProductExtraDipping {
    name?: string,
    price?: number | null
}

export interface OrderedProductExtraTopping {
    name?: string,
    price?: number | null
}

export interface OrderedProductSides {
    name?: string,
    price?: number | null | undefined,
}

export interface OrderedProductDessert {
    name?: string,
    price?: number
}

export interface OrderedProductDrinks {
    name?: string,
    price?: number
}

export interface ProductByTiming {
    compositeId: string;
    id: string;
    timeOfDay?: string;
    timeOfDayId?: string;
    deliveryTimings?: string;
    deliveryTimingsId?: string;
    name?: string;
    detail?: string;
    estimatedDeliveryTime?: string;
    spiceLevel?: string;
    type?: string;
    ingredientSummary?: string;
    image?: string;
    price?: number;
    categoryId: string;
    orderedProductExtraDippings?: OrderedProductExtraDipping[] | null;
    orderedProductExtraToppings?: OrderedProductExtraTopping[] | null;
    orderedProductChoices?: OrderedProductChoices[] | null;
    orderedProductSides?: OrderedProductSides | null;
    orderedProductDessert?: OrderedProductDessert | null;
    orderedProductDrinks?: OrderedProductDrinks | null;
}