import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RestaurantService, StorageService } from '../../services';
import { setFlashMessage } from '../flashMessages/flashMessageSlice';

interface Banner {
    Id: string;
    ImageUrl: string;
    IsActive: boolean;
    Sequence: number;
    Validity: Date;
    BrandId?: string;
    ProductId?: string;
    CategoryId?: string;
}

type Banners = Banner[];

interface Package {
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

type Packages = Package[];

interface ProductAllergy {
    AllergyName: string;
}

interface ProductPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductCategory {
    CategoryId: string;
    CategoryName: string;
    CategoryType: string;
}

interface ProductExtraDipping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraDippingAllergy: ProductExtraDippingAllergy[] | null;
    ProductExtraDippingPrice: ProductExtraDippingPrice[] | null;
}

interface ProductExtraDippingAllergy {
    AllergyName: string;
}

interface ProductExtraDippingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductExtraTopping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraToppingAllergy: ProductExtraToppingAllergy[] | null;
    ProductExtraToppingPrice: ProductExtraToppingPrice[] | null;
}

interface ProductExtraToppingAllergy {
    AllergyName: string;
}

interface ProductExtraToppingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductItemOutline {
    Id: string;
    Name: string;
}

interface ProductChoices {
    Name: string;
    Detail: string;
}

interface Product {
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

type Products = Product[];

interface SubCategory {
    Id: string;
    Name: string;
    ParentId: string;
    FranchiseId: string;
    Cover: string;
    Thumbnail: string;
    Description: string | null;
}

interface Brand {
    Id: string;
    Name: string;
    Cover: string;
    Thumbnail: string;
    Logo: string | null;
    Description: string | null;
    FranchiseId: string;
    SubCategories: SubCategory[] | null;
}

type Brands = Brand[];

interface Category {
    Id: string;
    Name: string;
    Cover: string;
    Thumbnail: string;
    Logo: string | null;
    Description: string | null;
    FranchiseId: string;
    SubCategories: SubCategory[] | null;
}

type Categories = Category[];

interface SubCategory {
    Id: string;
    Name: string;
    ParentId: string;
    FranchiseId: string;
    Cover: string;
    Thumbnail: string;
    Description: string | null;
}

type AllSubCategories = SubCategory[];

interface DashboardState {
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

// Create the initial state
const initialState: DashboardState = {
    clientId: '',
    franchiseId: '',
    banners: [],
    packages: [],
    products: [],
    brands: [],
    categories: [],
    allSubCategories: [],
    status: false,
    loadingDashboard: false,
};

function transformToBanners(data: any[]): Banners {
    return (data || []).map(banner => ({
        Id: banner.Id,
        ImageUrl: banner.ImageUrl,
        IsActive: banner.IsActive,
        Sequence: banner.Sequence,
        Validity: new Date(banner.Validity),
        BrandId: banner.BrandId,
        ProductId: banner.ProductId,
        CategoryId: banner.CategoryId
    }));
}

function transformToPackages(data: any[]): Packages {
    return (data || []).map(pkg => ({
        Id: pkg.Id,
        Name: pkg.Name,
        PackageType: pkg.PackageType,
        IncludesDrinks: pkg.IncludesDrinks,
        IncludesSides: pkg.IncludesSides,
        IncludesDessert: pkg.IncludesDessert,
        IncludesToppings: pkg.IncludesToppings,
        IncludesDippings: pkg.IncludesDippings,
        IncludesDelivery: pkg.IncludesDelivery,
        Price: pkg.Price,
        FranchiseId: pkg.FranchiseId
    }));
}

function transformToProducts(data: any[]): Products {
    return (data || []).map(product => ({
        Id: product.Id,
        Name: product.Name,
        Detail: product.Detail,
        EstimatedDeliveryTime: product.EstimatedDeliveryTime,
        Sequence: product.Sequence,
        SpiceLevel: product.SpiceLevel,
        Type: product.Type,
        IngredientSummary: product.IngredientSummary,
        IngredientDetail: product.IngredientDetail,
        Image: product.Image,
        IsActive: product.IsActive,
        ShowExtraTopping: product.ShowExtraTopping,
        ShowExtraDipping: product.ShowExtraDipping,
        ProductAllergy: product.ProductAllergy,
        ProductPrice: product.ProductPrice,
        ProductCategory: product.ProductCategory,
        CategoryId: product.CategoryId,
        ProductExtraDipping: product.ProductExtraDipping,
        ProductExtraTopping: product.ProductExtraTopping,
        ProductItemOutline: product.ProductItemOutline,
        ProductChoices: product.ProductChoices
    }));
}

function transformToBrands(data: any[]): Brands {
    return (data || []).map(brand => ({
        Id: brand.Id,
        Name: brand.Name,
        Cover: brand.Cover,
        Thumbnail: brand.Thumbnail,
        Logo: brand.Logo,
        Description: brand.Description,
        FranchiseId: brand.FranchiseId,
        SubCategories: brand.SubCategories
    }));
}

function transformToCategories(data: any[]): Categories {
    return (data || []).map(category => ({
        Id: category.Id,
        Name: category.Name,
        Cover: category.Cover,
        Thumbnail: category.Thumbnail,
        Logo: category.Logo,
        Description: category.Description,
        FranchiseId: category.FranchiseId,
        SubCategories: category.SubCategories
    }));
}

function transformToAllSubCategories(data: any[]): AllSubCategories {
    return (data || []).map(subCategory => ({
        Id: subCategory.Id,
        Name: subCategory.Name,
        ParentId: subCategory.ParentId,
        FranchiseId: subCategory.FranchiseId,
        Cover: subCategory.Cover,
        Thumbnail: subCategory.Thumbnail,
        Description: subCategory.Description
    }));
}

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async ({ FranchiseId }: { FranchiseId: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await RestaurantService.getDashboard({ FranchiseId });
            if (response.data) {
                console.log(response.data.brands);
                return {
                    clientId: response.data.clientId,
                    franchiseId: response.data.franchiseId,
                    banners: transformToBanners(response.data.banners || []),
                    packages: transformToPackages(response.data.packages || []),
                    products: transformToProducts(response.data.products || []),
                    brands: transformToBrands(response.data.brands || []),
                    categories: transformToCategories(response.data.categories || []),
                    allSubCategories: transformToAllSubCategories(response.data.allSubCategories || []),
                };
            }
            return {};
        } catch (error) {
            dispatch(setFlashMessage({ message: "Something went wrong. Please try again.", type: "error" }));
            return rejectWithValue(error);
        }
    }
);
// Create the franchise slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setCleintId: (state, action: PayloadAction<string>) => {
            state.clientId = action.payload;
        },
        setFranchiseId: (state, action: PayloadAction<string>) => {
            state.franchiseId = action.payload;
        },
        setBanner: (state, action: PayloadAction<any>) => {
            state.banners = action.payload;
        },
        setPackages: (state, action: PayloadAction<any>) => {
            state.packages = action.payload;
        },
        setProduct: (state, action: PayloadAction<any>) => {
            state.products = action.payload;
        },
        setCategories: (state, action: PayloadAction<any>) => {
            state.categories = action.payload;
        },
        setAllSubCategories: (state, action: PayloadAction<any>) => {
            state.allSubCategories = action.payload;
        },
        setStatus: (state, action: PayloadAction<boolean>) => {
            state.status = action.payload;
        },
        setLoadingDashbord: (state, action: PayloadAction<boolean>) => {
            state.loadingDashboard = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loadingDashboard = true;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                const { clientId, franchiseId, banners, packages, products, brands, categories, allSubCategories } = action.payload;
                state.clientId = clientId;
                state.franchiseId = franchiseId;
                state.banners = banners ?? [];
                state.packages = packages ?? [];
                state.products = products ?? [];
                state.brands = brands ?? [];
                state.categories = categories ?? [];
                state.allSubCategories = allSubCategories ?? [];
                state.status = true;
                state.loadingDashboard = false;
            })
            .addCase(fetchDashboardData.rejected, (state) => {
                state.status = false;
                state.loadingDashboard = false;
            });
    }
});

// Export the actions
export const {
    setCleintId,
    setFranchiseId,
    setBanner,
    setPackages,
    setProduct,
    setCategories,
    setAllSubCategories,
    setStatus,
    setLoadingDashbord,
} = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;