
interface Package {
    Id: string;
    Name: string;
    PackageType: number;
    IncludesDrinks: boolean;
    IncludesSides: boolean;
    IncludesDessert: boolean;
    IncludesToppings: boolean;
    IncludesDippings: boolean;
    IncludesDelivery: boolean;
    Price: number;
    FranchiseId: string,
}

type Packages = Package[];

interface ProductAllergy {
    AllergyName: string;
}

interface ProductPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductCategory {
    CategoryId: string;
    CategoryName: string;
    CategoryType: string;
}

interface ProductExtraDipping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraDippingAllergy: ProductExtraDippingAllergy[] | null;
    ProductExtraDippingPrice: ProductExtraDippingPrice[] | null;
}

interface ProductExtraDippingAllergy {
    AllergyName: string;
}

interface ProductExtraDippingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductExtraTopping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraToppingAllergy: ProductExtraToppingAllergy[] | null;
    ProductExtraToppingPrice: ProductExtraToppingPrice[] | null;
}

interface ProductExtraToppingAllergy {
    AllergyName: string;
}

interface ProductExtraToppingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductItemOutline {
    Id: string;
    Name: string;
}

interface ProductChoices {
    Name: string;
    Detail: string;
}

interface Dish {
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

interface DayWithDate {
    dayName: string;
    date: string;
}

interface DayWithDateAndSlots extends DayWithDate {
    dayId: string;
    slots: MealSelection;
}

interface MealSelection {
    Lunch?: string;
    Dinner?: string;
}

interface UserPreferences {
    generatedDates: DayWithDateAndSlots[] | null;
    preferredCategories: Array<{ categoryId: string; categoryName: string }>;
    excludedIngredients: string[];
    mealType: string;
    packageType: string;
}

interface PackagePerks {
    IncludesDrinks: boolean;
    IncludesSides: boolean;
    IncludesDessert: boolean;
    IncludesToppings?: boolean;
    IncludesDippings?: boolean;
}

interface MealPlan {
    date: string;
    meals: MealsForTheDay;
}

interface MealsForTheDay {
    [key: string]: MealDetails | undefined;
    Lunch?: MealDetails;
    Dinner?: MealDetails;
}

interface MealDetails {
    dish: Dish;
    perks: Perks;
}

interface Perks {
    IncludesDrinks: boolean;
    IncludesSides: boolean;
    IncludesDessert: boolean;
    IncludesToppings?: boolean;
    IncludesDippings?: boolean;
}

const packagePerks: { [key: string]: PackagePerks } = {
    Basic: { IncludesDrinks: false, IncludesSides: false, IncludesDessert: false },
    Standard: { IncludesDrinks: true, IncludesSides: false, IncludesDessert: true },
    Premium: { IncludesDrinks: true, IncludesSides: true, IncludesDessert: true, IncludesToppings: true, IncludesDippings: true },
};

function filterDishes(dishes: Dish[], mealType: string, excludedIngredients: string[]): Dish[] {
    return dishes.filter(dish => {
        const containsExcludedIngredient = dish.ProductItemOutline?.some(item => excludedIngredients.includes(item.Name));
        return dish.Type === mealType && !containsExcludedIngredient;
    });
}

function selectDishForMeal(filteredDishes: Dish[], preferredCategories: string[]): Dish {
    // Filter the dishes to only include those that belong to preferred categories
    const preferredDishes = filteredDishes.filter(dish =>
        dish.ProductCategory.some(category => preferredCategories.includes(category.CategoryId))
    );

    // Choose a dish based on availability in preferred categories
    if (preferredDishes.length > 0) {
        return preferredDishes[Math.floor(Math.random() * preferredDishes.length)];
    } else {
        return filteredDishes[Math.floor(Math.random() * filteredDishes.length)];
    }
}

function addPerksToMeal(meal: Dish[], perks: PackagePerks): any {
    return {
        dishes: meal,
        perks: perks
    };
}

export function createMealPlan(userPreferences: UserPreferences, dishes: Dish[]): MealPlan[] {
    const filteredDishes = filterDishes(dishes, userPreferences.mealType, userPreferences.excludedIngredients);
    const mealPlanArray: MealPlan[] = [];

    userPreferences.generatedDates?.forEach(date => {
        const mealsForTheDay: MealsForTheDay = {};

        Object.keys(date.slots).forEach(slot => {
            const selectedDish = selectDishForMeal(filteredDishes, userPreferences.preferredCategories.map(cat => cat.categoryId));
            mealsForTheDay[slot] = {
                dish: selectedDish,
                perks: packagePerks[userPreferences.packageType]
            };
        });

        mealPlanArray.push({
            date: date.date,
            meals: mealsForTheDay
        });
    });

    return mealPlanArray;
}
