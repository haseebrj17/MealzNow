import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../Store';
import {
    Cart,
    CustomerOrderedPackage,
    CustomerOrderPayment,
    CustomerOrderPromo,
    ProductByDay,
    ProductByTiming
} from '../../types/cart';

const initialCartState: Cart = {
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
        orderType: 'Delivery'
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        addToCart: (state, action: PayloadAction<ProductByTiming>) => {
            if (typeof action.payload.price === 'number') {
                state.totalItems += 1;
                state.totalBill += action.payload.price;
            } else {
                console.warn("Product added without a price.");
            }
        },
        setCart: (state, action: PayloadAction<Cart>) => {
            return action.payload;
        },
        clearCart: (state) => {
            return initialCartState;
        },
        addProductsByDay: (state, action: PayloadAction<ProductByDay[]>) => {
            state.productByDay = action.payload;
        },
        updateTotals: (state, action: PayloadAction<{ totalItems: number; totalBill: number }>) => {
            state.totalItems = action.payload.totalItems;
            state.totalBill = action.payload.totalBill;
        },
        updateOrderDetails: (state, action: PayloadAction<{ totalBill?: number; totalItems?: number; instructions?: string; orderDeliveryDateTime?: Date }>) => {
            const { totalBill, totalItems, instructions, orderDeliveryDateTime } = action.payload;
            if (totalBill !== undefined) state.totalBill = totalBill;
            if (totalItems !== undefined) state.totalItems = totalItems;
            if (instructions !== undefined) state.instructions = instructions;
            if (orderDeliveryDateTime !== undefined) state.orderDeliveryDateTime = orderDeliveryDateTime.toISOString();
        },
        updateCustomerInfo: (state, action: PayloadAction<{ customerId?: string; customerAddressId?: string }>) => {
            const { customerId, customerAddressId } = action.payload;
            if (customerId !== undefined) state.customerId = customerId;
            if (customerAddressId !== undefined) state.customerAddressId = customerAddressId;
        },
        updateFranchiseInfo: (state, action: PayloadAction<{ franchiseId?: string }>) => {
            const { franchiseId } = action.payload;
            if (franchiseId !== undefined) state.franchiseId = franchiseId;
        },
        updateCustomerOrderedPackage: (state, action: PayloadAction<CustomerOrderedPackage>) => {
            if (state.customerOrderedPackage) {
                state.customerOrderedPackage = {
                    ...state.customerOrderedPackage,
                    ...action.payload
                };
            } else {
                state.customerOrderedPackage = action.payload;
            }
        },
        updateCustomerOrderPromo: (state, action: PayloadAction<CustomerOrderPromo>) => {
            state.customerOrderPromo = action.payload;
        },
        setPaymentDetails: (state, action: PayloadAction<CustomerOrderPayment>) => {
            state.customerOrderPayment = action.payload;
        },
        addProductByDay: (state, action: PayloadAction<ProductByDay>) => {
            state.productByDay.push(action.payload);
        },
        addOrderDeliveryDateTime: (state, action: PayloadAction<{ orderDeliveryDateTime: string }>) => {
            state.orderDeliveryDateTime = action.payload.orderDeliveryDateTime;
        },
    },
});

export const {
    addToCart,
    setCart,
    clearCart,
    updateOrderDetails,
    updateCustomerInfo,
    updateCustomerOrderedPackage,
    updateCustomerOrderPromo,
    setPaymentDetails,
    addProductByDay,
    addProductsByDay,
    updateTotals,
    updateFranchiseInfo,
    addOrderDeliveryDateTime
} = cartSlice.actions;

export default cartSlice.reducer;
