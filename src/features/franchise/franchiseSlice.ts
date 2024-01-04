import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RestaurantService, StorageService } from '../../services';
import { setFlashMessage } from '../flashMessages/flashMessageSlice';

interface FranchiseDetails {
    Id: string;
    Title: string;
    Address: string;
    ZipCode: string;
    ContactNumber: string;
    OpeningTime: string;
    ClosingTime: string;
    Latitude: number;
    Longitude: number;
    CoverageAreaInMeters: number;
    IsActive: boolean;
    ClientId: string;
    CityId: string;
    CityName: string;
    StateId: string;
    StateName: string;
}

interface ServingTimeSlot {
    Id: string;
    SlotStart: string;
    SlotEnd: string;
}

interface ServingTiming {
    Id: string;
    Name: string;
    ServingTime: ServingTimeSlot[];
}

interface FranchiseTiming {
    Id: string;
    Day: string;
    OpeningTime: string;
    ClosingTime: string;
    Open: boolean;
    ServingTimings: ServingTiming[];
}

type FranchiseTimings = FranchiseTiming[];

interface FranchiseHoliday {
    Id: string;
    From: Date;
    To: Date;
}

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

interface DishOfDay {
    Id: string;
    ImageUrl: string;
    IsActive: boolean;
    Validity: Date;
    ProductId?: string;
    Sequence: number;
}

interface FranchiseSetting {
    Id: string;
    MealsPerDay: MealPerDay[];
    ServingDays: ServingDay[];
}

interface MealPerDay {
    Id: string;
    Title: string;
    Description: string;
    Discount: number;
    Icon: string;
    Timings: number;
}

interface ServingDay {
    Id: string;
    Name: string;
}

interface ProductOutline {
    Id: string;
    Title: string;
    Description: string;
    Icon: string;
    ProductInclusion: ProductInclusionItem[];
}

interface ProductInclusionItem {
    Id: string;
    Name: string;
    Icon: string;
}

interface FranchiseState {
    franchiseDetails: FranchiseDetails | null;
    franchiseTimings: FranchiseTimings;
    franchiseHolidays: FranchiseHoliday[];
    dishOfDay: DishOfDay[];
    banner: Banner[];
    franchiseSetting: FranchiseSetting | null;
    productOutline: ProductOutline[];
    status: boolean;
    loadingFranchise: boolean;
}

const initialState: FranchiseState = {
    franchiseDetails: null,
    franchiseTimings: [],
    franchiseHolidays: [],
    dishOfDay: [],
    banner: [],
    franchiseSetting: null,
    productOutline: [],
    status: false,
    loadingFranchise: false,
};

function transformToFranchiseDetails(data: any): FranchiseDetails | null {
    return {
        Id: data.Id,
        Title: data.Title,
        Address: data.Address,
        ZipCode: data.ZipCode,
        ContactNumber: data.ContactNumber,
        OpeningTime: data.OpeningTime,
        ClosingTime: data.ClosingTime,
        Latitude: data.Latitude,
        Longitude: data.Longitude,
        CoverageAreaInMeters: data.CoverageAreaInMeters,
        IsActive: data.IsActive,
        ClientId: data.ClientId,
        CityId: data.CityId,
        CityName: data.CityName,
        StateId: data.StateId,
        StateName: data.StateName
    };
}

function transformToFranchiseTimings(data: any): FranchiseTimings {
    return data.FranchiseTimings.map((timing: FranchiseTiming) => ({
        Id: timing.Id,
        Day: timing.Day,
        OpeningTime: timing.OpeningTime,
        ClosingTime: timing.ClosingTime,
        Open: timing.Open,
        ServingTimings: timing.ServingTimings.map((serving: ServingTiming) => ({
            Id: serving.Id,
            Name: serving.Name,
            ServingTime: serving.ServingTime.map((slot: ServingTimeSlot) => ({
                Id: slot.Id,
                SlotStart: slot.SlotStart,
                SlotEnd: slot.SlotEnd
            }))
        }))
    }));
}

function transformToFranchiseHolidays(data: any): FranchiseHoliday[] {
    return data.FranchiseHolidays.map((holiday: FranchiseHoliday) => ({
        Id: holiday.Id,
        From: new Date(holiday.From),
        To: new Date(holiday.To)
    }));
}

function transformToBanner(data: any[]): Banner[] {
    return data.map(banner => ({
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

function transformToDishOfDay(data: any[]): DishOfDay[] {
    return data.map(dish => ({
        Id: dish.Id,
        ImageUrl: dish.ImageUrl,
        IsActive: dish.IsActive,
        Validity: new Date(dish.Validity),
        ProductId: dish.ProductId,
        Sequence: dish.Sequence
    }));
}

function transformToFranchiseSetting(data: any): FranchiseSetting {
    return {
        Id: data.Id,
        MealsPerDay: data.MealsPerDay ? data.MealsPerDay.map((meal: MealPerDay) => ({
            Id: meal.Id,
            Title: meal.Title,
            Description: meal.Description,
            Discount: meal.Discount,
            Icon: meal.Icon,
            Timings: meal.Timings
        })) : [],
        ServingDays: data.ServingDays ? data.ServingDays.map((day: ServingDay) => ({
            Id: day.Id,
            Name: day.Name
        })) : []
    };
}

function transformToProductOutline(data: any[]): ProductOutline[] {
    return data.map((outline: ProductOutline) => ({
        Id: outline.Id,
        Title: outline.Title,
        Description: outline.Description,
        Icon: outline.Icon,
        ProductInclusion: outline.ProductInclusion.map((inclusion: ProductInclusionItem) => ({
            Id: inclusion.Id,
            Name: inclusion.Name,
            Icon: inclusion.Icon
        }))
    }));
}

// Async thunk for fetching franchise data
export const fetchFranchiseData = createAsyncThunk(
    'franchise/fetchFranchiseData',
    async (clientId: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await RestaurantService.getFranchises({ clientId });
            return response?.data;
        } catch (error) {
            dispatch(setFlashMessage({ message: "Something went wrong. Please try again.", type: "error" }));
            return rejectWithValue(error);
        }
    }
);

// Create the franchise slice
const franchiseSlice = createSlice({
    name: 'franchise',
    initialState,
    reducers: {
        setFranchiseDetails: (state, action: PayloadAction<any>) => {
            state.franchiseDetails = action.payload;
        },
        setFranchiseTimings: (state, action: PayloadAction<any>) => {
            state.franchiseTimings = action.payload;
        },
        setFranchiseHolidays: (state, action: PayloadAction<any>) => {
            state.franchiseHolidays = action.payload;
        },
        setDishOfDay: (state, action: PayloadAction<any>) => {
            state.dishOfDay = action.payload;
        },
        setBanner: (state, action: PayloadAction<any>) => {
            state.banner = action.payload;
        },
        setFranchiseSetting: (state, action: PayloadAction<any>) => {
            state.franchiseSetting = action.payload;
        },
        setProductOutline: (state, action: PayloadAction<any>) => {
            state.productOutline = action.payload;
        },
        setStatus: (state, action: PayloadAction<boolean>) => {
            state.status = action.payload;
        },
        setLoadingFranchise: (state, action: PayloadAction<boolean>) => {
            state.loadingFranchise = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFranchiseData.pending, (state) => {
                state.loadingFranchise = true;
            })
            .addCase(fetchFranchiseData.fulfilled, (state, action) => {
                const franchiseData = action.payload;
                if (franchiseData && franchiseData.length > 0) {
                    const franchiseDataItem = franchiseData[0];

                    state.franchiseDetails = transformToFranchiseDetails(franchiseDataItem);
                    state.franchiseTimings = transformToFranchiseTimings(franchiseDataItem);
                    state.franchiseHolidays = transformToFranchiseHolidays(franchiseDataItem);
                    state.dishOfDay = transformToDishOfDay(franchiseDataItem.DishOfDay);
                    state.banner = transformToBanner(franchiseDataItem.Banner);
                    state.franchiseSetting = transformToFranchiseSetting(franchiseDataItem.FranchiseSetting[0]);
                    state.productOutline = transformToProductOutline(franchiseDataItem.ProductOutline);
                    state.status = true;
                }
                state.loadingFranchise = false;
            })
            .addCase(fetchFranchiseData.rejected, (state) => {
                state.status = false;
                state.loadingFranchise = false;
            });
    }
});

export const {
    setFranchiseDetails,
    setFranchiseTimings,
    setFranchiseHolidays,
    setDishOfDay,
    setBanner,
    setFranchiseSetting,
    setProductOutline,
    setStatus,
    setLoadingFranchise,
} = franchiseSlice.actions;

// Export the reducer
export default franchiseSlice.reducer;