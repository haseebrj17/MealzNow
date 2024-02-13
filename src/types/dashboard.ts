import { Banner } from "./franchise";

export type Banners = Banner[];

export interface Package {
    Id: string;
    Name: string;
    PackageType: number;
    IncludesDrinks: boolean;
    IncludesSides: boolean;
    IncludesDessert: boolean;
    IncludesToppings: boolean;
    IncludesDippings: boolean;
    IncludesDelivery: boolean;
    Price: number;
    FranchiseId: string,
}

export type Packages = Package[];

export interface ProductAllergy {
    AllergyName: string;
}

export interface ProductPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

export interface ProductCategory {
    CategoryId: string;
    CategoryName: string;
    CategoryType: string;
}

export interface ProductExtraDipping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraDippingAllergy: ProductExtraDippingAllergy[] | null;
    ProductExtraDippingPrice: ProductExtraDippingPrice[] | null;
}

export interface ProductExtraDippingAllergy {
    AllergyName: string;
}

export interface ProductExtraDippingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

export interface ProductExtraTopping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraToppingAllergy: ProductExtraToppingAllergy[] | null;
    ProductExtraToppingPrice: ProductExtraToppingPrice[] | null;
}

export interface ProductExtraToppingAllergy {
    AllergyName: string;
}

export interface ProductExtraToppingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

export interface ProductItemOutline {
    Id: string;
    Name: string;
}

export interface ProductChoices {
    Name: string;
    Detail: string;
}

export interface Product {
    Id: string;
    Name: string;
    Detail: string;
    EstimatedDeliveryTime: number,
    Sequence: number;
    SpiceLevel: number;
    Type: string;
    IngredientSummary: string;
    IngredientDetail: string;
    Image: string;
    IsActive: boolean;
    ShowExtraTopping: boolean;
    ShowExtraDipping: boolean;
    ProductAllergy: ProductAllergy[] | null;
    ProductPrice: ProductPrice[];
    ProductCategory: ProductCategory[];
    CategoryId: string;
    ProductExtraDipping: ProductExtraDipping[] | null;
    ProductExtraTopping: ProductExtraTopping[] | null;
    ProductItemOutline: ProductItemOutline[] | null;
    ProductChoices: ProductChoices[] | null;
}

export type Products = Product[];

export interface SubCategory {
    Id: string;
    Name: string;
    ParentId: string;
    FranchiseId: string;
    Cover: string;
    Thumbnail: string;
    Description: string | null;
}

export interface Brand {
    Id: string;
    Name: string;
    Cover: string;
    Thumbnail: string;
    Logo: string | null;
    Description: string | null;
    FranchiseId: string;
    SubCategories: SubCategory[] | null;
}

export type Brands = Brand[];

export interface Category {
    Id: string;
    Name: string;
    Cover: string;
    Thumbnail: string;
    Logo: string | null;
    Description: string | null;
    FranchiseId: string;
    SubCategories: SubCategory[] | null;
}

export type Categories = Category[];

export interface SubCategory {
    Id: string;
    Name: string;
    ParentId: string;
    FranchiseId: string;
    Cover: string;
    Thumbnail: string;
    Description: string | null;
}

export type AllSubCategories = SubCategory[];

export interface DashboardState {
    clientId: string;
    franchiseId: string;
    banners: Banners;
    packages: Packages;
    products: Products;
    brands: Brands;
    categories: Categories;
    allSubCategories: AllSubCategories;
    status: boolean;
    loadingDashboard: boolean;
}
