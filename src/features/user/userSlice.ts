import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { GetOrderService, RestaurantService, StorageService } from '../../services';
import { setFlashMessage } from '../flashMessages/flashMessageSlice';
import {
    Banner,
    DishOfDay,
    FranchiseDetails,
    FranchiseHoliday,
    FranchiseSetting,
    FranchiseState,
    FranchiseTiming,
    FranchiseTimings,
    MealPerDay,
    ProductInclusionItem,
    ProductOutline,
    ServingDay,
    ServingTimeSlot,
    ServingTiming
} from '../../types/franchise';
import { User } from '../../types/user';
import { ProductByDay, ProductByTiming } from '../../types/cart';

const initialState: User = {
    order: {
        id: '',
        orderStatus: 0,
        customerDetails: {
            customerFullName: '',
            customerEmailAddress: '',
            customerContactNumber: '',
            customerAddressDetail: {
                streetAddress: '',
                house: '',
                postalCode: '',
                cityName: '',
                district: '',
                unitNumber: '',
                floorNumber: '',
                stateName: '',
                countryName: '',
                notes: '',
                latitude: 0,
                longitude: 0,
                cityId: ''
            }
        },
        totalBill: 0,
        totalItems: 0,
        orderDeliveryDateTime: new Date().toISOString(),
        instructions: '',
        customerId: '',
        customerAddressId: '',
        franchiseId: '',
        productByDay: [],
        customerOrderedPackage: {
            packageId: '',
            packageName: '',
            timings: 0,
            totalNumberOfMeals: 0,
            numberOfDays: 0,
            numberOfWeeks: 0,
            mealzPerDay: '',
        },
        customerOrderPromo: {
            type: '',
            name: '',
            percent: '',
        },
        customerOrderPayment: {
            paymentType: 'COD',
            orderType: 1,
        }
    },
    status: false,
    loadingUserData: false,
};

function transformCustomerDetails(data: any) {
    return {
        customerFullName: data.CustomerFullName,
        customerEmailAddress: data.CustomerEmailAddress,
        customerContactNumber: data.CustomerContactNumber,
        customerAddressDetail: transformCustomerAddressDetail(data.CustomerAddressDetail),
    };
}

function transformCustomerAddressDetail(data: any) {
    return {
        streetAddress: data.StreetAddress,
        house: data.House,
        postalCode: data.PostalCode,
        cityName: data.CityName,
        district: data.District,
        unitNumber: data.UnitNumber,
        floorNumber: data.FloorNumber,
        stateName: data.StateName,
        countryName: data.CountryName,
        notes: data.Notes,
        latitude: data.Latitude,
        longitude: data.Longitude,
        cityId: data.CityId,
    };
}

function transformCustomerOrderedPackage(data: any) {
    return {
        packageId: data.PackageId,
        packageName: data.PackageName,
        timings: data.Timings,
        totalNumberOfMeals: data.TotalNumberOfMeals,
        numberOfDays: data.NumberOfDays,
        numberOfWeeks: data.NumberOfWeeks,
        mealzPerDay: data.MealzPerDay,
    };
}

function transformCustomerOrderPromo(data: any) {
    return {
        type: data.Type,
        name: data.Name,
        percent: data.Percent,
    };
}

function transformCustomerOrderPayment(data: any) {
    return {
        id: data.Id,
        paymentType: data.PaymentType,
        orderType: data.OrderType,
    };
}

function transformProductByDay(data: any[]): ProductByDay[] {
    return data.map(day => ({
        day: day.Day,
        dayId: day.DayId,
        deliveryDate: day.DeliveryDate,
        productByTiming: day.ProductByTiming.map((timing: any) => transformProductByTiming(timing)),
    }));
}

function transformProductByTiming(data: any): ProductByTiming {
    return {
        compositeId: data.CompositeId,
        id: data.Id,
        timeOfDay: data.TimeOfDay,
        timeOfDayId: data.TimeOfDayId,
        deliveryTimings: data.DeliveryTimings,
        deliveryTimingsId: data.DeliveryTimingsId,
        name: data.Name,
        detail: data.Detail,
        estimatedDeliveryTime: data.EstimatedDeliveryTime,
        spiceLevel: data.SpiceLevel,
        type: data.Type,
        ingredientSummary: data.IngredientSummary,
        image: data.Image,
        price: data.Price,
        categoryId: data.CategoryId,
        orderedProductExtraDippings: data.OrderedProductExtraDippings || [],
        orderedProductExtraToppings: data.OrderedProductExtraToppings || [],
        orderedProductChoices: data.OrderedProductChoices || [],
        orderedProductSides: data.OrderedProductSides || null,
        orderedProductDessert: data.OrderedProductDessert || null,
        orderedProductDrinks: data.OrderedProductDrinks || null,
    };
}

function transformOrderData(data: any) {
    return {
        id: data.Id,
        orderStatus: data.OrderStatus,
        customerDetails: transformCustomerDetails(data.CustomerDetails),
        totalBill: data.TotalBill,
        totalItems: data.TotalItems,
        orderDeliveryDateTime: data.OrderDeliveryDateTime,
        instructions: data.Instructions,
        customerId: data.CustomerId,
        customerAddressId: data.CustomerAddressId,
        franchiseId: data.FranchiseId,
        productByDay: transformProductByDay(data.ProductByDay),
        customerOrderedPackage: transformCustomerOrderedPackage(data.CustomerOrderedPackage),
        customerOrderPromo: transformCustomerOrderPromo(data.CustomerOrderPromo),
        customerOrderPayment: transformCustomerOrderPayment(data.CustomerOrderPayment),
    };
}

// Async thunk for fetching user order data
export const fetchUserOrder = createAsyncThunk(
    'User/fetchUserOrder',
    async (token: string, { dispatch, rejectWithValue }) => {
        try {
            const response = await GetOrderService.getUserOrder(token);
            console.log(response)
            return response?.data;
        } catch (error) {
            dispatch(setFlashMessage({ message: "Something went wrong. Please try again.", type: "error" }));
            return rejectWithValue(error);
        }
    }
);

// Create the franchise slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserOrder.pending, (state) => {
                state.loadingUserData = true;
            })
            .addCase(fetchUserOrder.fulfilled, (state, action) => {
                const userData = action.payload;
                if (userData && userData.length > 0) {
                    state.order = transformOrderData(userData[0]);
                    state.status = true;
                }
                state.loadingUserData = false;
            })
            .addCase(fetchUserOrder.rejected, (state) => {
                state.status = false;
                state.loadingUserData = false;
            });
    }
});

// Export the reducer
export default userSlice.reducer;