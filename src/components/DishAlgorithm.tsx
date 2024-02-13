import { DayWithDateAndSlots } from '../types/temp';
import { Dish, MealPlan, MealsForTheDay, Perks, UserPreferences } from '../types/meal';
import { CustomerPackage } from '../types/customer';
import { ProductByDay } from '../types/cart';
import { useSelector } from 'react-redux';
import { RootState } from 'src/Store';

const packagePerks: { [key: string]: Perks } = {
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

function addPerksToMeal(meal: Dish[], perks: Perks): any {
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

        if (date.slots.Lunch) {
            const selectedDishForLunch = selectDishForMeal(filteredDishes, userPreferences.preferredCategories.map(cat => cat.categoryId));
            mealsForTheDay["Lunch"] = {
                timing: date.slots.Lunch.Time,
                timingId: date.slots.Lunch.Id,
                dish: selectedDishForLunch,
                perks: packagePerks[userPreferences.packageType]
            };
        }

        if (date.slots.Dinner) {
            const selectedDishForDinner = selectDishForMeal(filteredDishes, userPreferences.preferredCategories.map(cat => cat.categoryId));
            mealsForTheDay["Dinner"] = {
                timing: date.slots.Dinner.Time,
                timingId: date.slots.Dinner.Id,
                dish: selectedDishForDinner,
                perks: packagePerks[userPreferences.packageType]
            };
        }

        mealPlanArray.push({
            dayId: date.dayId,
            day: date.dayName,
            date: date.date,
            meals: mealsForTheDay
        });
    });

    return mealPlanArray;
}
