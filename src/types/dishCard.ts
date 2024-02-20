import { CustomerOrderPayment, ProductByDay, ProductByTiming } from "./cart";

export interface DishCardProps {
    dish?: ProductByTiming;
    today?: ProductByDay;
    customerOrderPayment: CustomerOrderPayment;
}