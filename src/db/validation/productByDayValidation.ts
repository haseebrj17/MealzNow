import * as yup from 'yup';
import { ProductByTiming, productByTimingValidation } from './productByTimingValidation';

export const productByDayValidation = yup.object().shape({
    day: yup.string().required(),
    dayId: yup.string().required(),
    deliveryDate: yup.date().required(),
    products: yup.array().of(productByTimingValidation).required(),
});

export interface ProductByDay {
    day?: string,
    dayId?: string,
    deliveryDate?: Date,
    products?: ProductByTiming[]
}
