export const CartSchema = {
    name: 'Cart',
    primaryKey: '_id',
    properties: {
        _id: 'string',
        type: 'string',
        totalBill: 'int',
        totalItems: 'int',
        orderDeliveryDateTime: 'date',
        instructions: 'string?',
        customerId: 'string',
        customerAddressId: 'string',
        franchiseId: 'string',
        customerOrderedPackage: 'CustomerOrderedPackage?',
        productByDay: 'ProductByDay[]',
        customerOrderPromo: 'CustomerOrderPromo?',
        customerOrderPayment: 'CustomerOrderPayment'
    }
};

export const CustomerOrderedPackageSchema = {
    name: 'CustomerOrderedPackage',
    properties: {
        packageId: 'string?',
        packageName: 'string?',
        totalNumberOfMeals: 'int?',
        numberOfDays: 'int?'
    }
};

export const CustomerOrderPromoSchema = {
    name: 'CustomerOrderPromo',
    properties: {
        type: 'string?',
        name: 'string?',
        percent: 'string?'
    }
};

export const CustomerOrderPaymentSchema = {
    name: 'CustomerOrderPayment',
    properties: {
        paymentType: 'string?',
        orderType: 'string?'
    }
};

export const ProductByDaySchema = {
    name: 'ProductByDay',
    properties: {
        day: 'string?',
        dayId: 'string?',
        deliveryDate: 'date?',
        products: 'ProductByTiming[]',
    }
};

export const ProductByTimingSchema = {
    name: 'ProductByTiming',
    properties: {
        timeOfDay: 'string?',
        timeOfDayId: 'string?',
        deliveryTimings: 'date?',
        deliveryTimingsId: 'string?',
        name: 'string?',
        detail: 'string?',
        estimatedDeliveryTime: 'string?',
        spiceLevel: 'string?',
        type: 'string?',
        ingredientSummary: 'string?',
        image: 'string?',
        price: 'int?',
        orderedProductExtraDippings: 'OrderedProductExtraDipping[]',
        orderedProductExtraToppings: 'OrderedProductExtraTopping[]',
        orderedProductSides: 'OrderedProductSides?',
        orderedProductDesserts: 'OrderedProductDessert?',
        orderedProductDrinks: 'OrderedProductDrinks?',
        orderedProductChoices: 'OrderedProductChoices?'
    }
}

export const OrderedProductExtraDippingSchema = {
    name: 'OrderedProductExtraDipping',
    properties: {
        name: 'string?',
        price: 'int?'
    }
};

export const OrderedProductExtraToppingSchema = {
    name: 'OrderedProductExtraTopping',
    properties: {
        name: 'string?',
        price: 'int?'
    }
};

export const OrderedProductSidesSchema = {
    name: 'OrderedProductSides',
    properties: {
        name: 'string?',
        price: 'int?',
        orderProductId: 'string?'
    }
};

export const OrderedProductDessertSchema = {
    name: 'OrderedProductDessert',
    properties: {
        name: 'string?',
        price: 'int?'
    }
};

export const OrderedProductDrinksSchema = {
    name: 'OrderedProductDrinks',
    properties: {
        name: 'string?',
        price: 'int?'
    }
};

export const OrderedProductChoicesSchema = {
    name: 'OrderedProductChoices',
    properties: {
        name: 'string?',
        detail: 'string?'
    }
};
