import * as yup from 'yup';

export interface CustomerOrderPayment {
    paymentType?: string,
    orderType?: string
}

export const customerOrderPaymentValidation = yup.object().shape({
    paymentType: yup.string().required(),
    orderType: yup.string().required(),
});
