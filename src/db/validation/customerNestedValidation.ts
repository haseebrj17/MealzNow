import * as yup from 'yup';
import { 
    CustomerProductInclusion,
    customerProductInclusionValidation, 
    PreferredCategories, 
    preferredCategoriesValidation,
    PreferredSubCategories,
    preferredSubCategoriesValidation
} from './prefrenceValidation';

export interface CustomerPackage {
    packageId?: string,
    packageName?: string,
    totalNumberOfMeals?: number,
    numberOfDays?: number
}

export interface CustomerPayment {
    paymentType?: string,
    orderType?: string
}

export interface CustomerPromo {
    type?: string,
    name?: string,
    percent?: string
}

export interface CustomerDevice {
    deviceId?: string,
    isActive?: boolean
}

export interface CustomerPassword {
    hash?: string,
    password?: string
}

export interface Preference {
    preferredCategories?: PreferredCategories[],
    preferredSubCategories?: PreferredSubCategories[]
}

export interface CustomerProductOutline {
    title?: string,
    description?: string,
    icon?: string,
    outlineId?: string,
    customerProductInclusion?: CustomerProductInclusion[]
}

export const customerPackageValidation = yup.object().shape({
    packageId: yup.string().required(),
    packageName: yup.string().required(),
    totalNumberOfMeals: yup.number().required(),
    numberOfDays: yup.number().required(),
});

export const customerPaymentValidation = yup.object().shape({
    paymentType: yup.string().required(),
    orderType: yup.string().required(),
});

export const customerPromoValidation = yup.object().shape({
    type: yup.string().required(),
    name: yup.string().required(),
    percent: yup.string().required(),
});

export const customerDeviceValidation = yup.object().shape({
    deviceId: yup.string().required(),
    isActive: yup.bool().required()
})

export const preferenceValidation = yup.object().shape({
    preferredCategories: yup.array().of(preferredCategoriesValidation),
    preferredSubCategories: yup.array().of(preferredSubCategoriesValidation),
})

export const customerProductOutlineValidation = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    icon: yup.string().required(),
    outlineId: yup.string().required(),
    customerProductInclusion: yup.array().of(customerProductInclusionValidation)
})

