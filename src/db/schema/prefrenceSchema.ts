import * as yup from 'yup';

export interface PreferredCategories {
    categoryId?: string,
    categoryName?: string
}

export interface PreferredSubCategories {
    subCategoryId?: string,
    subCategoryName?: string
}

export interface CustomerProductInclusion {
    name?: string,
    icon?: string,
    productInclusionId?: string
}

export const preferredCategoriesSchema = yup.object().shape({
    categoryId: yup.string(),
    categoryName: yup.string()
})

export const preferredSubCategoriesSchema = yup.object().shape({
    subCategoryId: yup.string(),
    subCategoryName: yup.string()
})

export const customerProductInclusionSchema = yup.object().shape({
    name: yup.string(),
    icon: yup.string(),
    productInclusionId: yup.string()
})
