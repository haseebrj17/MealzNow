import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../services';
import { setFlashMessage } from '../flashMessages/flashMessageSlice';

interface GeneralState {
    isAppLoading: boolean;
    token: string;
    isFirstTimeUse: boolean;
    userData: any;
    location: any;
}


const initialState: GeneralState = {
    isAppLoading: true,
    token: '',
    isFirstTimeUse: true,
    userData: {},
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
            state.userData = {};
        }
    },
    extraReducers: {
    }
});

export const {
    setIsAppLoading,
    setToken,
    setIsFirstTimeUse,
    setUserData,
    setLocation,
    clearToken,
    clearUserData
} = generalSlice.actions;

export default generalSlice.reducer;

export const appStart = () => async (dispatch: any) => {
    try {
        const isFirstTimeUse = await StorageService.getFirstTimeUse();
        dispatch(setIsFirstTimeUse(!isFirstTimeUse));

        const token = await StorageService.getToken();
        if (token) {
            dispatch(setToken(token));

            const location = await StorageService.getLocation();
            dispatch(setLocation(location || {}));

            const userData = await StorageService.getUserData();
            dispatch(setUserData(userData || {}));
        }
    } catch (error) {
        console.error("Error during app start:", error);
        dispatch(setFlashMessage({ message: "An error occurred during app initialization.", type: "error" }));
    } finally {
        dispatch(setIsAppLoading(false));
    }
};



// interface UserData {
//     Id: string;
//     FullName: string;
//     EmailAdress: string,
//     ContactNumber: string,
//     UserRole: string,
//     FranchiseId: string
// }

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