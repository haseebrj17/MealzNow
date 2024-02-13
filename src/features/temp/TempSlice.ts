import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../Store';
import { DayWithDateAndSlots, Temp } from '../../types/temp';
import { Package } from '../../types/dashboard';

const initialTempState: Temp = {
    generatedDates: [],
    packageType: {
        Id: '',
        Name: '',
        PackageType: 0,
        IncludesDrinks: false,
        IncludesSides: false,
        IncludesDessert: false,
        IncludesToppings: false,
        IncludesDippings: false,
        IncludesDelivery: false,
        Price: 0,
        FranchiseId: '',
    }
};

const tempSlice = createSlice({
    name: 'temp',
    initialState: initialTempState,
    reducers: {
        setGeneratedDates: (state, action: PayloadAction<DayWithDateAndSlots[]>) => {
            state.generatedDates = action.payload;
        },
        setPackageType: (state, action: PayloadAction<Package>) => {
            state.packageType = action.payload;
        }
    },
});

export const {
    setGeneratedDates,
    setPackageType,
} = tempSlice.actions;

export default tempSlice.reducer;
