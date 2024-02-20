import { Cart } from "./cart";
import { Customer } from "./customer";

export interface CustomerDetails {
    customerFullName: string;
    customerEmailAddress: string;
    customerContactNumber: string;
    customerAddressDetail: CustomerAddressDetail;
}

export interface CustomerAddressDetail {
    streetAddress: string;
    house: string | number | null;
    postalCode: string | number | null;
    cityName: string | null;
    district: string | null;
    unitNumber: string | number | null;
    floorNumber: string | number | null;
    stateName: string | null;
    countryName: string | null;
    notes: string | null;
    latitude: number;
    longitude: number;
    cityId: string | null;
}

export interface Order extends Cart {
    id: string;
    orderStatus: number;
    customerDetails: CustomerDetails;
}

export interface User {
    order: Order;
    status: boolean,
    loadingUserData: boolean
}