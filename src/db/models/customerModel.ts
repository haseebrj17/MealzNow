export const CustomerSchema = {
    name: 'Customer',
    properties: {
        _id: 'string?',
        type: 'string?',
        fullName: 'string?',
        emailAddress: 'string?',
        contactNumber: 'string?',
        password: 'string?',
        isNumberVerified: 'bool?',
        isEmailVerified: 'bool?',
        cityId: 'string?',
        preference: 'Preference[]',
        customerProductOutline: 'CustomerProductOutline',
        customerPackage: 'CustomerPackage',
        customerPromo: 'CustomerPromo?',
        customerPayment: 'CustomerPayment',
        customerDevice: 'CustomerDevice[]'
    },
    primaryKey: '_id',
};

export const PreferenceSchema = {
    name: 'Preference',
    properties: {
        preferredCategories: 'PreferredCategories[]',
        preferredSubCategories: 'PreferredSubCategories[]'
    }
};

export const PreferredCategoriesSchema = {
    name: 'PreferredCategories',
    properties: {
        categoryName: 'string?',
        categoryId: 'string?'
    }
};

export const PreferredSubCategoriesSchema = {
    name: 'PreferredSubCategories',
    properties: {
        subCategoryName: 'string?',
        subCategoryId: 'string?'
    }
};

export const CustomerProductOutlineSchema = {
    name: 'CustomerProductOutline',
    properties: {
        title: 'string?',
        description: 'string?',
        icon: 'string?',
        outlineId: 'string?',
        customerProductInclusion: 'CustomerProductInclusion[]'
    }
};

export const CustomerProductInclusionSchema = {
    name: 'CustomerProductInclusion',
    properties: {
        inclusionName: 'string?',
        inclusionDetail: 'string?',
        inclusionId: 'string?'
    }
};

export const CustomerPackageSchema = {
    name: 'CustomerPackage',
    properties: {
        packageId: 'string?',
        packageName: 'string?',
        totalNumberOfMeals: 'int?',
        numberOfDays: 'int?'
    }
};

export const CustomerPaymentSchema = {
    name: 'CustomerPayment',
    properties: {
        paymentType: 'string?',
        orderType: 'string?'
    }
};

export const CustomerPromoSchema = {
    name: 'CustomerPromo',
    properties: {
        type: 'string?',
        name: 'string?',
        percent: 'string?'
    }
};

export const CustomerDeviceSchema = {
    name: 'CustomerDevice',
    properties: {
        deviceId: 'string?',
        isActive: 'bool?'
    }
};
