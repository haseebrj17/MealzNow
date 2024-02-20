import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../services';
import { setFlashMessage } from '../flashMessages/flashMessageSlice';
import jwt_Decode from "jwt-decode";
import { setCustomerId } from '../order/orderSlice';
import { GeneralState } from '../../types/general';
import { updateCustomerInfo, updateFranchiseInfo } from '../cart/cartSlice';

const initialState: GeneralState = {
    isAppLoading: true,
    token: '',
    isFirstTimeUse: true,
    isOrderPlaced: false,
    userData: {
        Id: '',
        FullName: '',
        EmailAdress: '',
        ContactNumber: '',
        UserRole: '',
        FranchiseId: '',
        exp: 0,
        iss: '',
        aud: ''
    },
    location: {}
};

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setIsAppLoading: (state, action: PayloadAction<boolean>) => {
            state.isAppLoading = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setIsFirstTimeUse: (state, action: PayloadAction<boolean>) => {
            state.isFirstTimeUse = action.payload;
        },
        setIsOrderPlaced: (state, action: PayloadAction<boolean>) => {
            state.isOrderPlaced = action.payload;
        },
        setUserData: (state, action: PayloadAction<any>) => {
            state.userData = action.payload;
        },
        setLocation: (state, action: PayloadAction<any>) => {
            state.location = action.payload;
        },
        clearToken: (state) => {
            state.token = '';
        },
        clearUserData: (state) => {
            state.userData = {
                Id: '',
                FullName: '',
                EmailAdress: '',
                ContactNumber: '',
                UserRole: '',
                FranchiseId: '',
                exp: 0,
                iss: '',
                aud: ''
            };
        }
    },
    extraReducers: {
    }
});

export const {
    setIsAppLoading,
    setToken,
    setIsFirstTimeUse,
    setIsOrderPlaced,
    setUserData,
    setLocation,
    clearToken,
    clearUserData
} = generalSlice.actions;

export default generalSlice.reducer;

export const appStart = () => async (dispatch: any) => {
    try {
        const isFirstTimeUseStr = await StorageService.getFirstTimeUse();
        const isFirstTimeUse = isFirstTimeUseStr !== 'false';
        dispatch(setIsFirstTimeUse(isFirstTimeUse));

        const isOrderPlacedStr = await StorageService.getOrderPlaced();
        const isOrderPlaced = isOrderPlacedStr === 'true';
        dispatch(setIsOrderPlaced(isOrderPlaced));

        const token = await StorageService.getToken();
        if (token) {
            dispatch(setToken(token));

            const location = await StorageService.getLocation();
            dispatch(setLocation(location || {}));

            const userData = JSON.parse(StorageService.getUserData() || '{}');
            dispatch(setUserData(userData || {}));

            dispatch(setCustomerId(userData?.Id));

            dispatch(updateCustomerInfo({ customerId: userData?.Id }))

            dispatch(updateFranchiseInfo({ franchiseId: userData?.FranchiseId }))
        }
    } catch (error) {
        console.error("Error during app start:", error);
        dispatch(setFlashMessage({ message: "An error occurred during app initialization.", type: "error" }));
    } finally {
        dispatch(setIsAppLoading(false));
    }
};

// interface Location {
//     Id: string;
//     StreetAddress: string;
//     PostalCode: string;
//     House: string;
//     District: string;
//     UnitNumber: string;
//     FloorNumber: string;
//     Notes: string;
//     Tag: string;
//     IsDefault: boolean;
//     Latitude: number;
//     Longitude: number;
//     CityName: string | null;
//     CountryName: string | null;
//     StateName: string | null;
//     CustomerId: string;
//     City: {
//         Name: string;
//     };
// }