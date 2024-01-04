import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RestaurantService, StorageService } from '../../services';
import { setFlashMessage } from '../flashMessages/flashMessageSlice';

// Define an interface for the state
interface DashboardState {
    clientId: string;
    franchiseId: string;
    banner: any;
    packages: any;
    products: any;
    categories: any;
    allSubCategories: any;
    status: boolean;
    loadingDashboard: boolean;
}

// Create the initial state
const initialState: DashboardState = {
    clientId: '',
    franchiseId: '',
    banner: null,
    packages: null,
    products: null,
    categories: null,
    allSubCategories: null,
    status: false,
    loadingDashboard: false,
};

// Async thunk for fetching franchise data
export const fetchDashboardData = createAsyncThunk(
    'restaurant/fetchDashboardData',
    async ({ FranchiseId }: { FranchiseId: string }, { dispatch, rejectWithValue }) => {
        try {
            const response = await RestaurantService.getDashboard({ FranchiseId });
            return response.data;
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
            state.banner = action.payload;
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
                    const dashboardData = action.payload;
                    console.log("dashboardData", dashboardData);
                    state.clientId = dashboardData?.clientId;
                    state.franchiseId = dashboardData?.franchiseId;
                    state.banner = dashboardData?.banners;
                    state.packages = dashboardData?.packages;
                    state.products = dashboardData?.products;
                    state.categories = dashboardData?.categories;
                    state.allSubCategories = dashboardData?.allSubCategories;
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