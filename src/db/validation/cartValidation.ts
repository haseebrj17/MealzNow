import * as yup from 'yup';
import { ProductByDay, productByDayValidation } from './productByDayValidation';
import { CustomerOrderedPackage, customerOrderedPackageValidation } from './customerOrderedPackageValidation';
import { CustomerOrderPromo, customerOrderPromoValidation } from './customerOrderPromoValidation';
import { CustomerOrderPayment, customerOrderPaymentValidation } from './customerOrderPaymentValidation';

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

export const cartValidation = yup.object().shape({
    _id: yup.string().required(),
    type: yup.string().required(),
    totalBill: yup.number().required(),
    totalItems: yup.number().required(),
    orderDeliveryDateTime: yup.date().required(),
    instructions: yup.string(),
    customerId: yup.string().required(),
    customerAddressId: yup.string().required(),
    franchiseId: yup.string().required(),
    customerOrderedPackage: customerOrderedPackageValidation,
    productByDay: yup.array().of(productByDayValidation),
    customerOrderPromo: customerOrderPromoValidation,
    customerOrderPayment: customerOrderPaymentValidation
});
