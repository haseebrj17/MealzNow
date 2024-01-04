import * as yup from 'yup';

export interface CustomerOrderPromo {
    type?: string,
    name?: string,
    percent?: string
}

export const customerOrderPromoSchema = yup.object().shape({
    type: yup.string().required(),
    name: yup.string().required(),
    percent: yup.string().required(),
});