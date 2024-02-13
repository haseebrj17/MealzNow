import * as yup from 'yup';

export interface CustomerOrderedPackage {
    packageId?: string,
    packageName?: string,
    totalNumberOfMeals?: number,
    numberOfDays?: number
}

export const customerOrderedPackageValidation = yup.object().shape({
    packageId: yup.string().required(),
    packageName: yup.string().required(),
    totalNumberOfMeals: yup.number().required(),
    numberOfDays: yup.number().required(),
});