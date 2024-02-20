enum OrderTypes {
    Delivery = 1,
    PickUp = 2,
}

type OrderType = typeof OrderTypes[keyof typeof OrderTypes];

interface CustomerOrderPayment {
    paymentType: string;
    orderType: OrderTypes;
}

export const getOrderType = (order: CustomerOrderPayment): string => {
    return OrderTypes[order.orderType];
};
