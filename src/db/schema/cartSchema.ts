import * as yup from 'yup';
import { ProductByDay, productByDaySchema } from './productByDaySchema';
import { CustomerOrderedPackage, customerOrderedPackageSchema } from './customerOrderedPackageSchema';
import { CustomerOrderPromo, customerOrderPromoSchema } from './customerOrderPromoSchema';
import { CustomerOrderPayment, customerOrderPaymentSchema } from './customerOrderPaymentSchema';

export interface Cart {
    _id?: string,
    type?: string,
    totalBill?: number,
    totalItems?: number,
    orderDeliveryDateTime?: Date,
    instructions?: string,
    customerId?: string,
    customerAddressId?: string,
    franchiseId?: string,
    customerOrderedPackage?: CustomerOrderedPackage,
    productByDay?: ProductByDay[],
    customerOrderPromo?: CustomerOrderPromo,
    customerOrderPayment?: CustomerOrderPayment   
}

export const cartSchema = yup.object().shape({
    _id: yup.string().required(),
    type: yup.string().required(),
    totalBill: yup.number().required(),
    totalItems: yup.number().required(),
    orderDeliveryDateTime: yup.date().required(),
    instructions: yup.string(),
    customerId: yup.string().required(),
    customerAddressId: yup.string().required(),
    franchiseId: yup.string().required(),
    customerOrderedPackage: customerOrderedPackageSchema,
    productByDay: yup.array().of(productByDaySchema),
    customerOrderPromo: customerOrderPromoSchema,
    customerOrderPayment: customerOrderPaymentSchema
});
