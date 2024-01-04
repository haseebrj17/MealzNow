import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { StorageService } from "../../services";
import { setFlashMessage } from "../flashMessages/flashMessageSlice";
import {
    insertCustomerOrderPayment,
    insertCustomerOrderPromo,
    insertCustomerOrderedPackage,
    insertProductByDay,
    insertProductByTiming,
} from "../../db/methods/cartNestedOperations";
import { insertIntoCart } from "../../db/methods/cartOperations";

export const insertCustomerOrderThunk = createAsyncThunk(
    "order/insertCustomerOrder",
    async (orderData: {
        orderId: string;
        totalBill: number;
        totalItems: number;
        orderDeliveryDateTime: string;
        instructions: string;
        customerId: string;
        customerAddressId: string;
        franchiseId: string;
        orderStatus: string;
        customerOrderedPackageId: string;
        customerOrderPromoId?: string;
        customerOrderPaymentId?: string;
    }) => {
        const result = await insertIntoCart(orderData);
        return result;
    }
);

export const insertCustomerOrderedPackageThunk = createAsyncThunk(
    "order/insertCustomerOrderedPackage",
    async (customerOrderedPackageData: {
        customerOrderedPackageId: string;
        packageId: string;
        packageName: string;
        totalNumberOfMeals: number;
        numberOfDays: number;
    }) => {
        const result = await insertCustomerOrderedPackage(
            customerOrderedPackageData
        );
        return result;
    }
);

export const insertCustomerOrderPromoThunk = createAsyncThunk(
    "order/insertCustomerOrderPromo",
    async (customerOrderPromoData: {
        customerOrderPromoId: string;
        type: string;
        name: string;
        percent: string;
    }) => {
        const result = await insertCustomerOrderPromo(customerOrderPromoData);
        return result;
    }
);


export const insertCustomerOrderPaymentThunk = createAsyncThunk(
    "order/insertCustomerOrderPayment",
    async (paymentData: {
        paymentType: string;
        orderType: string
    }) => {
        const result = await insertCustomerOrderPayment(paymentData);
        return result;
    }
);

export const insertProductByDayThunk = createAsyncThunk(
    "order/insertProductByDay",
    async (productByDayData: {
        dayId: string,
        day: string,
        deliveryDate: string,
        orderId: string
    }) => {
        const result = await insertProductByDay(productByDayData);
        return result;
    }
);

export const insertProductByTimingThunk = createAsyncThunk(
    "order/insertProductByTiming",
    async (productByTimingData: {
        productTimingId: string,
        dayId?: string,
        timeOfDayId: string,
        fulfilled: number,
        timeOfDay: string,
        deliveryTimings: string,
        name: string,
        detail: string,
        estimatedDeliveryTime?: string,
        spiceLevel?: number,
        type?: string,
        ingredientSummary: string,
        image: string,
        price: number
    }) => {
        const result = await insertProductByTiming(productByTimingData);
        return result;
    }
);

interface CustomerOrderedPackage {
    packageId: string;
    packageName: string;
    totalNumberOfMeals: number;
    numberOfDays: number;
}

interface CustomerOrderPromo {
    type: string;
    name: string;
    percent: string;
}

interface CustomerOrderPayment {
    paymentType: string;
    orderType: string;
}

interface OrderState {
    error: string;
    order: {
        totalBill: number;
        totalItems: number;
        orderDeliveryDateTime: Date;
        instructions: string;
        customerId: string;
        customerAddressId: string;
        franchiseId: string;
        orderStatus: string;
        customerOrderedPackage: CustomerOrderedPackage;
        productByDay: any[];
        customerOrderPromo: CustomerOrderPromo;
        customerOrderPayment: CustomerOrderPayment;
    };
}

const initialState: OrderState = {
    error: "",
    order: {
        totalBill: 0,
        totalItems: 0,
        orderDeliveryDateTime: new Date(),
        instructions: "",
        customerId: "",
        customerAddressId: "",
        franchiseId: "",
        orderStatus: "",
        customerOrderedPackage: {
            packageId: "",
            packageName: "",
            totalNumberOfMeals: 0,
            numberOfDays: 0,
        },
        productByDay: [],
        customerOrderPromo: {
            type: "",
            name: "",
            percent: "",
        },
        customerOrderPayment: {
            paymentType: "",
            orderType: "",
        },
    },
};

export const orderSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        setTotalBill: (state, action: PayloadAction<number>) => {
            state.order.totalBill = action.payload;
        },
        setTotalItems: (state, action: PayloadAction<number>) => {
            state.order.totalItems = action.payload;
        },
        setOrderDeliveryDateTime: (state, action: PayloadAction<Date>) => {
            state.order.orderDeliveryDateTime = action.payload;
        },
        setInstructions: (state, action: PayloadAction<string>) => {
            state.order.instructions = action.payload;
        },
        setCustomerId: (state, action: PayloadAction<string>) => {
            state.order.customerId = action.payload;
        },
        setCustomerAddressId: (state, action: PayloadAction<string>) => {
            state.order.customerAddressId = action.payload;
        },
        setFranchiseId: (state, action: PayloadAction<string>) => {
            state.order.franchiseId = action.payload;
        },
        setOrderStatus: (state, action: PayloadAction<string>) => {
            state.order.orderStatus = action.payload;
        },
        setCustomerOrderedPackage: (
            state,
            action: PayloadAction<CustomerOrderedPackage>
        ) => {
            state.order.customerOrderedPackage = action.payload;
        },
        setProductByDay: (state, action: PayloadAction<any[]>) => {
            state.order.productByDay = action.payload;
        },
        setCustomerOrderPromo: (
            state,
            action: PayloadAction<CustomerOrderPromo>
        ) => {
            state.order.customerOrderPromo = action.payload;
        },
        setCustomerOrderPayment: (
            state,
            action: PayloadAction<CustomerOrderPayment>
        ) => {
            state.order.customerOrderPayment = action.payload;
        },
    },
    extraReducers: {},
});

export const {
    setTotalBill,
    setTotalItems,
    setOrderDeliveryDateTime,
    setInstructions,
    setCustomerId,
    setCustomerAddressId,
    setFranchiseId,
    setOrderStatus,
    setCustomerOrderedPackage,
    setProductByDay,
    setCustomerOrderPromo,
    setCustomerOrderPayment,
} = orderSlice.actions;

export default orderSlice.reducer;
