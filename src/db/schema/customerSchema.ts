import * as yup from "yup";
import {
    CustomerDevice,
    CustomerPackage,
    CustomerPassword,
    CustomerPayment,
    CustomerProductOutline,
    CustomerPromo,
    Preference,
    customerDeviceSchema,
    customerPackageSchema,
    customerPasswordSchema,
    customerPaymentSchema,
    customerProductOutlineSchema,
    customerPromoSchema,
    preferenceSchema,
} from "./customerNestedSchema";

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
    customerPassword?: CustomerPassword;
    customerDevice?: CustomerDevice;
}

export const customerSchema = yup.object().shape({
    _id: yup.string().required(),
    type: yup.string().required(),
    fullName: yup.string().required(),
    emailAddress: yup.string().email().required(),
    contactNumber: yup.string().required(),
    password: yup.string().required(),
    isNumberVerified: yup.bool().required(),
    isEmailVerified: yup.bool().required(),
    cityId: yup.string(),
    preference: preferenceSchema.required(),
    customerProductOutline: customerProductOutlineSchema.required(),
    customerPackage: customerPackageSchema.required(),
    customerPromo: customerPromoSchema,
    customerPayment: customerPaymentSchema.required(),
    customerPassword: customerPasswordSchema.required(),
    customerDevice: customerDeviceSchema.required(),
});


