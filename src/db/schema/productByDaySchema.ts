import * as yup from 'yup';
import { ProductByTiming, productByTimingSchema } from './productByTimingSchema';

export const productByDaySchema = yup.object().shape({
    day: yup.string().required(),
    dayId: yup.string().required(),
    deliveryDate: yup.date().required(),
    products: yup.array().of(productByTimingSchema).required(),
});

export interface ProductByDay {
    day?: string,
    dayId?: string,
    deliveryDate?: Date,
    products?: ProductByTiming[]
}
