
export interface FranchiseDetails {
    Id: string;
    Title: string;
    Address: string;
    ZipCode: string;
    ContactNumber: string;
    OpeningTime: string;
    ClosingTime: string;
    Latitude: number;
    Longitude: number;
    CoverageAreaInMeters: number;
    IsActive: boolean;
    ClientId: string;
    CityId: string;
    CityName: string;
    StateId: string;
    StateName: string;
}

export interface ServingTimeSlot {
    Id: string;
    SlotStart: string;
    SlotEnd: string;
}

export interface ServingTiming {
    Id: string;
    Name: string;
    ServingTime: ServingTimeSlot[];
}

export interface FranchiseTiming {
    Id: string;
    Day: string;
    OpeningTime: string;
    ClosingTime: string;
    Open: boolean;
    ServingTimings: ServingTiming[];
}

export type FranchiseTimings = FranchiseTiming[];

export interface FranchiseHoliday {
    Id: string;
    From: Date;
    To: Date;
}

export interface Banner {
    Id: string;
    ImageUrl: string;
    IsActive: boolean;
    Sequence: number;
    Validity: Date;
    BrandId?: string;
    ProductId?: string;
    CategoryId?: string;
}

export interface DishOfDay {
    Id: string;
    ImageUrl: string;
    IsActive: boolean;
    Validity: Date;
    ProductId?: string;
    Sequence: number;
}

export interface FranchiseSetting {
    Id: string;
    MealsPerDay: MealPerDay[];
    ServingDays: ServingDay[];
}

export interface MealPerDay {
    Id: string;
    Title: string;
    Description: string;
    Discount: number;
    Icon: string;
    Timings: number;
}

export interface ServingDay {
    Id: string;
    Name: string;
}

export interface ProductOutline {
    Id: string;
    Title: string;
    Description: string;
    Icon: string;
    ProductInclusion: ProductInclusionItem[];
}

export interface ProductInclusionItem {
    Id: string;
    Name: string;
    Icon: string;
}

export interface FranchiseState {
    franchiseDetails: FranchiseDetails | null;
    franchiseTimings: FranchiseTimings;
    franchiseHolidays: FranchiseHoliday[];
    dishOfDay: DishOfDay[];
    banner: Banner[];
    franchiseSetting: FranchiseSetting | null;
    productOutline: ProductOutline[];
    status: boolean;
    loadingFranchise: boolean;
}