import { Package } from "./dashboard";

export interface DayWithDate {
    dayName: string;
    date: string;
}

export interface DayWithDateAndSlots extends DayWithDate {
    dayId: string;
    slots: MealSelection;
}

export interface MealSelection {
    Lunch?: SlotDetail;
    Dinner?: SlotDetail;
}

export interface SlotDetail {
    Id: string;
    Time: string;
}

export interface Temp {
    generatedDates?: DayWithDateAndSlots[] | null;
    package?: Package | null;
    packageType?: Package | null;
}