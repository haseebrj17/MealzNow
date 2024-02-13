import { Package, ProductAllergy, ProductCategory, ProductChoices, ProductExtraDipping, ProductExtraTopping, ProductItemOutline, ProductPrice } from "./dashboard";
import { DayWithDateAndSlots } from "./temp";

export interface MealPlan {
    dayId: string;
    day: string;
    date: string;
    meals: MealsForTheDay;
}

export interface MealsForTheDay {
    [key: string]: MealDetails | undefined;
    Lunch?: MealDetails;
    Dinner?: MealDetails;
}

export interface MealDetails {
    timing: string;
    timingId: string;
    dish: Dish;
    perks: Perks;
}

export interface Dish {
    Id: string;
    Name: string;
    Detail: string;
    EstimatedDeliveryTime: number,
    Sequence: number;
    SpiceLevel: number;
    Type: string;
    IngredientSummary: string;
    IngredientDetail: string;
    Image: string;
    IsActive: boolean;
    ShowExtraTopping: boolean;
    ShowExtraDipping: boolean;
    ProductAllergy: ProductAllergy[] | null;
    ProductPrice: ProductPrice[];
    ProductCategory: ProductCategory[];
    CategoryId: string;
    ProductExtraDipping: ProductExtraDipping[] | null;
    ProductExtraTopping: ProductExtraTopping[] | null;
    ProductItemOutline: ProductItemOutline[] | null;
    ProductChoices: ProductChoices[] | null;
}

export interface Perks {
    IncludesDrinks: boolean;
    IncludesSides: boolean;
    IncludesDessert: boolean;
    IncludesToppings?: boolean;
    IncludesDippings?: boolean;
}

export interface UserPreferences {
    generatedDates: DayWithDateAndSlots[];
    preferredCategories: Array<{ categoryId: string; categoryName: string }>;
    excludedIngredients: string[];
    mealType: string;
    packageType: string;
}
