import * as yup from "yup";
import {
    CustomerDevice,
    CustomerPackage,
    CustomerPassword,
    CustomerPayment,
    CustomerProductOutline,
    CustomerPromo,
    Preference,
    customerDeviceValidation,
    customerPackageValidation,
    customerPaymentValidation,
    customerProductOutlineValidation,
    customerPromoValidation,
    preferenceValidation,
} from "./customerNestedValidation";

export interface Customer {
    _id?: string;
    type?: string;
    fullName?: string;
    emailAddress?: string;
    contactNumber?: string;
    password?: string;
    isNumberVerified?: boolean;
    isEmailVerified?: boolean;
    cityId?: string;
    preference?: Preference;
    customerProductOutline?: CustomerProductOutline;
    customerPackage?: CustomerPackage;
    customerPromo?: CustomerPromo;
    customerPayment?: CustomerPayment;
    customerDevice?: CustomerDevice;
}

export const customerValidation = yup.object().shape({
    _id: yup.string().required(),
    type: yup.string().required(),
    fullName: yup.string().required(),
    emailAddress: yup.string().email().required(),
    contactNumber: yup.string().required(),
    password: yup.string().required(),
    isNumberVerified: yup.bool().required(),
    isEmailVerified: yup.bool().required(),
    cityId: yup.string(),
    preference: preferenceValidation.required(),
    customerProductOutline: customerProductOutlineValidation.required(),
    customerPackage: customerPackageValidation.required(),
    customerPromo: customerPromoValidation,
    customerPayment: customerPaymentValidation.required(),
    customerDevice: customerDeviceValidation.required(),
});


