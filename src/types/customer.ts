
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
    preference?: Preference | null;
    customerProductOutline: CustomerProductOutline;
    customerPackage: CustomerPackage;
    customerPromo?: CustomerPromo;
    customerPayment: CustomerPayment;
    customerPassword: CustomerPassword;
    customerDevice: CustomerDevice[];
}

export interface Preference {
    preferredCategories: PreferredCategories[] | null;
    preferredSubCategories: PreferredSubCategories[] | null;
}

export interface PreferredCategories {
    categoryName: string;
    categoryId: string;
}

export interface PreferredSubCategories {
    subCategoryName: string;
    subCategoryId: string;
}

export interface CustomerProductOutline {
    title?: string;
    description?: string;
    icon?: string;
    outlineId?: string;
    customerProductInclusion?: CustomerProductInclusion[] | null;
}

export interface CustomerProductInclusion {
    inclusionName: string;
    inclusionDetail: string;
    inclusionId: string;
}

export interface CustomerPackage {
    packageId: string;
    packageName: string;
    timings: number;
    totalNumberOfMeals: number;
    numberOfDays: number;
    numberOfWeeks: number;
    mealzPerDay: string;
}

export interface CustomerPayment {
    paymentType?: string;
    orderType?: string;
}

export interface CustomerPromo {
    promoId?: string;
    type?: string;
    name?: string;
    percent?: string;
}

export interface CustomerPassword {
    hash?: string;
    password?: string;
}

export interface CustomerDevice {
    deviceId?: string;
    isActive?: boolean;
}

export interface CustomerState {
    customer: Customer | null;
}