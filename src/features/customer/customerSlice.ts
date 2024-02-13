import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../Store';
import {
  Customer,
  CustomerDevice,
  CustomerPackage,
  CustomerPassword,
  CustomerPayment,
  CustomerProductInclusion,
  CustomerProductOutline,
  CustomerPromo,
  CustomerState,
  PreferredCategories,
  PreferredSubCategories
} from '../../types/customer';

const initialState: CustomerState = {
  customer: {
    _id: '',
    type: '',
    fullName: '',
    emailAddress: '',
    contactNumber: '',
    password: '',
    isNumberVerified: false,
    isEmailVerified: false,
    cityId: '',
    preference: {
      preferredCategories: null,
      preferredSubCategories: null,
    },
    customerProductOutline: {
      title: '',
      description: '',
      icon: '',
      outlineId: '',
      customerProductInclusion: null,
    },
    customerPackage: {
      packageId: '',
      packageName: '',
      timings: 0,
      totalNumberOfMeals: 0,
      numberOfDays: 0,
      numberOfWeeks: 0,
      mealzPerDay: '',
    },
    customerPromo: {
      type: '',
      name: '',
      percent: '',
    },
    customerPayment: {
      paymentType: '',
      orderType: '',
    },
    customerPassword: {
      hash: '',
      password: '',
    },
    customerDevice: [],
  },
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    updateCustomerProductOutline: (state, action: PayloadAction<CustomerProductOutline>) => {
      if (state.customer) {
        state.customer.customerProductOutline = action.payload;
      }
    },
    updateCustomerProductInclusion: (state, action: PayloadAction<CustomerProductInclusion[]>) => {
      if (state.customer) {
        if (!state.customer.customerProductOutline) {
          state.customer.customerProductOutline = {
            title: '',
            description: '',
            icon: '',
            outlineId: '',
            customerProductInclusion: action.payload,
          };
        } else {
          state.customer.customerProductOutline = {
            ...state.customer.customerProductOutline,
            customerProductInclusion: action.payload,
          };
        }
      }
    },
    updatePreferenceCategories: (state, action: PayloadAction<PreferredCategories[]>) => {
      if (state.customer && state.customer.preference) {
        state.customer.preference.preferredCategories = action.payload;
      }
    },
    updatePreferredSubCategories: (state, action: PayloadAction<PreferredSubCategories[]>) => {
      if (state.customer && state.customer.preference) {
        state.customer.preference.preferredSubCategories = action.payload;
      }
    },
    updateCustomerPackage: (state, action: PayloadAction<CustomerPackage>) => {
      if (state.customer && state.customer.customerPackage) {
        state.customer.customerPackage = {
          ...state.customer.customerPackage,
          ...action.payload
        };
      } else if (state.customer) {
        state.customer.customerPackage = action.payload;
      }
    },
    updateCustomerPromo: (state, action: PayloadAction<CustomerPromo>) => {
      if (state.customer) {
        state.customer.customerPromo = action.payload;
      }
    },
    updateCustomerPayment: (state, action: PayloadAction<CustomerPayment>) => {
      if (state.customer) {
        state.customer.customerPayment = action.payload;
      }
    },
    updateCustomerPassword: (state, action: PayloadAction<CustomerPassword>) => {
      if (state.customer) {
        state.customer.customerPassword = action.payload;
      }
    },
    updateCustomerDevice: (state, action: PayloadAction<CustomerDevice[]>) => {
      if (state.customer) {
        state.customer.customerDevice = action.payload;
      }
    },
    setCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.customer = action.payload;
    },
    finalizeSubscription: (state) => {
      state.customer = null;
    }
  },
});

export const {
  updateCustomerProductOutline,
  updateCustomerProductInclusion,
  updatePreferenceCategories,
  setCustomer,
  finalizeSubscription,
  updateCustomerPackage,
  updateCustomerPromo,
  updateCustomerPayment,
  updateCustomerPassword,
  updateCustomerDevice,
  updatePreferredSubCategories,
} = customerSlice.actions;

export default customerSlice.reducer;