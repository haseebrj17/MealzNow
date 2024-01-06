import { View, Text, TouchableOpacity, Image, FlatList, Button } from 'react-native'
import React, { Children, useEffect, useRef, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'; // or NavigationProp from '@react-navigation/native'
import { Stepper } from '../components'
import { theme } from '../theme/theme';
import { useFonts } from '../hooks/useFonts';
import { Display, fDateCustom } from '../utils';
import Vegetarian from '../assets/icons/Vegetarian';
import Omnivore from '../assets/icons/Omnivore';
import { useDispatch, useSelector } from 'react-redux';
import { setFlashMessage } from '../features/flashMessages/flashMessageSlice';
import FlashMessage from '../components/flashMessage';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { logAllTables } from '../db/DataLog';
import { RouteProp } from '@react-navigation/native';
import { RootState } from '../Store';
import { getDataFromTable, getDataFromTableWithLimit } from '../db/methods/common';
import LottieView from 'lottie-react-native';
import { createMealPlan } from '../components/DishAlgorithm';
import { getImageAspectRatioWithCallBack } from '../utils/ImageAspect';

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

interface UserPreferencesState {
    generatedDates: DayWithDateAndSlots[];
    preferredCategories: { categoryId: string; categoryName: string }[];
    excludedIngredients: string[];
    mealType: string;
    packageType: string;
}

type RootStackParamList = {
    MealsScreenProps: { packageId: string | null, generatedDates: DayWithDateAndSlots[] | null };
};

type MealsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PreferredCuisineScreen'>;

interface MealsScreenProps {
    navigation: MealsScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'MealsScreenProps'>;
}


const renderItem = ({ item, index }: { item: MealPlan, index: number }) => {

    let aspectRatio = 3024 / 2095;

    return (
        <View
            style={{
                width: Display.setWidth(90),
                height: Display.setHeight(24),
                backgroundColor: theme.colors.accent.lighter,
                borderRadius: Display.setWidth(3),
                marginBottom: Display.setHeight(2),
                marginTop: Display.setHeight(1),
                alignItems: 'flex-start',
                justifyContent: 'center',
                shadowColor: theme.colors.primary.dark,
                shadowOffset: {
                    width: 5,
                    height: 4,
                },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 10,
            }}
        >
            <Text
                style={{
                    fontSize: Display.setHeight(2.2),
                    fontWeight: '500',
                    color: theme.colors.primary.dark,
                    marginLeft: theme.padding.medium,
                }}
            >{fDateCustom(item.date)}</Text>
            <View
                style={{
                    width: Display.setWidth(90),
                    height: Display.setHeight(16),
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
            >
                {item?.meals?.Lunch &&
                    <View
                        style={{
                            paddingRight: theme.padding.small,
                            paddingLeft: theme.padding.medium,
                            marginTop: Display.setHeight(1),
                            width: Display.setWidth(45),
                            height: Display.setHeight(16),
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontSize: Display.setHeight(1.5),
                                fontWeight: '500',
                                color: theme.colors.accent.textGray,
                            }}
                        >Lunch</Text>
                        <Text
                            style={{
                                marginTop: Display.setHeight(0.3),
                                fontSize: Display.setHeight(1.7),
                                fontWeight: '600',
                                color: theme.colors.custom[2].stromboli,
                            }}
                        >{item.meals.Lunch?.dish.Name}</Text>
                        <Image
                            source={{ uri: item.meals.Lunch?.dish.Image }}
                            style={{
                                width: Display.setWidth(30),
                                borderRadius: Display.setWidth(3),
                                height: 'auto',
                                aspectRatio: aspectRatio,
                                resizeMode: 'contain',
                                position: 'absolute',
                                left: theme.padding.medium,
                                bottom: -Display.setHeight(1),
                            }}
                        />
                    </View>
                }
                {item?.meals?.Dinner &&
                    <View
                        style={{
                            paddingRight: theme.padding.medium,
                            paddingLeft: theme.padding.small,
                            marginTop: Display.setHeight(1),
                            width: Display.setWidth(45),
                            height: Display.setHeight(16),
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontSize: Display.setHeight(1.5),
                                fontWeight: '500',
                                color: theme.colors.accent.textGray,
                            }}
                        >Dinner</Text>
                        <Text
                            style={{
                                marginTop: Display.setHeight(0.3),
                                fontSize: Display.setHeight(1.7),
                                fontWeight: '600',
                                color: theme.colors.custom[2].stromboli,
                            }}
                        >{item.meals.Dinner?.dish.Name}</Text>
                        <Image
                            source={{ uri: item.meals.Dinner?.dish.Image }}
                            style={{
                                width: Display.setWidth(30),
                                borderRadius: Display.setWidth(3),
                                height: 'auto',
                                aspectRatio: aspectRatio,
                                resizeMode: 'contain',
                                position: 'absolute',
                                left: theme.padding.small,
                                bottom: -Display.setHeight(1),
                            }}
                        />
                    </View>
                }
            </View>
        </View>
    )
}


const MealsScreen: React.FC<MealsScreenProps> = ({ navigation, route }) => {

    useEffect(() => {
        logAllTables();
    }, []);

    const { franchiseSetting, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    const { packages, products, loadingDashboard } = useSelector(
        (state: RootState) => state.dashboard
    );

    const [selectedType, setSelectedType] = useState<any | null>(null);
    const [disabled, setDisabled] = useState(true)
    const [timing, setTiming] = useState<string | null>(null);
    const [mealzPeyDay, setMealzPeyDay] = useState<MealPlan[]>([]);
    const [mealPlanCache, setMealPlanCache] = useState<{ [packageType: string]: MealPlan[] }>({});
    const [userPreferences, setUserPreferences] = useState<UserPreferencesState>({
        generatedDates: [],
        preferredCategories: [],
        excludedIngredients: [],
        mealType: '',
        packageType: ''
    });
    const [dishes, setDishes] = useState<Dish[]>([]);

    const handleSelectedType = (item: any) => {
        setSelectedType(item);
        setDisabled(false);
    };

    useEffect(() => {
        if (selectedType && dishes.length > 0 && userPreferences.generatedDates.length > 0) {
            loadMealPlans();
        }
    }, [selectedType, userPreferences, dishes]);

    const loadMealPlans = () => {
        const cachedMealPlans = mealPlanCache[selectedType?.Name];
        if (cachedMealPlans) {
            console.log('Loading meal plans from cache for package type:', selectedType?.Name);
            setMealzPeyDay(cachedMealPlans);
        } else {
            try {
                const mealPlanData = createMealPlan(userPreferences, dishes);
                setMealzPeyDay(mealPlanData);
                setMealPlanCache(prevCache => ({
                    ...prevCache,
                    [selectedType?.Name]: mealPlanData
                }));
            } catch (error) {
                console.error('Error in loadMealPlans:', error);
            }
        }
    };

    const refreshMealPlans = () => {
        console.log('Forcibly refreshing meal plans for package type:', selectedType?.Name);

        try {
            const mealPlanData = createMealPlan(userPreferences, dishes);
            setMealzPeyDay(mealPlanData);
            setMealPlanCache(prevCache => ({
                ...prevCache,
                [selectedType?.Name]: mealPlanData
            }));
        } catch (error) {
            console.error('Error in refreshMealPlans:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [route?.params?.packageId, route?.params?.generatedDates, franchiseSetting, selectedType?.Name, products]);

    const fetchData = async () => {
        // Fetch package data
        const packageData = await getDataFromTable(
            "CustomerPackage",
            ["timings", "totalNumberOfMeals", "numberOfDays", "numberOfWeeks"],
            "packageId = ?",
            [route?.params?.packageId]
        );
        const timing = packageData[0]?.timings;
        const timingString = franchiseSetting?.MealsPerDay.find(meal => meal.Timings === timing)?.Title ?? null;
        setTiming(timingString);

        // Fetch product outline ID and meal type
        const productOutlineData = await getDataFromTableWithLimit(
            "CustomerProductOutline",
            ["outlineId", "title"],
            '',
            [],
            1
        );
        const outlineId = productOutlineData[0]?.outlineId;
        const mealType = productOutlineData[0]?.title;

        // Fetch excluded ingredients
        const excludedIngredientsData = await getDataFromTable(
            "CustomerProductInclusion",
            ["name"],
            "productInclusionId = ?",
            [outlineId]
        );

        // Fetch preference ID
        const preferenceData = await getDataFromTableWithLimit(
            "Preference",
            ["preferenceId"],
            '',
            [],
            1
        );
        const preferenceId = preferenceData[0]?.preferenceId.toString();

        // Fetch preferred categories
        const preferredCategoriesData = await getDataFromTable(
            "PreferredCategories",
            ["categoryId"],
            "preferenceId = ?",
            [preferenceId]
        );

        // Update user preferences state
        setUserPreferences({
            generatedDates: route?.params?.generatedDates ?? [],
            preferredCategories: preferredCategoriesData ?? [],
            excludedIngredients: excludedIngredientsData ?? [],
            mealType: mealType ?? 'Omnivore',
            packageType: selectedType?.Name ?? 'Basic'
        });
        console.log('userPreferences', userPreferences);

        if (products.length > 0) {
            loadMealPlans();
        }

        setDishes(products)
    };

    return (
        <View
            style={{ backgroundColor: theme.colors.background.bgGrayPurple }}
        >
            <Stepper
                title={'Discover our exclusive meal packages specially curated for you.'}
                step={7}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={() => console.log('hello')}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.dark}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={disabled}
                details={""}
            >
                <FlatList
                    data={packages ? packages : []}
                    keyExtractor={(item) => item.Id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    contentContainerStyle={{
                        width: Display.setWidth(90),
                        margin: Display.setWidth(2),
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    zIndex: 10,
                                    width: Display.setWidth(23),
                                    height: Display.setHeight(3.5),
                                    backgroundColor: item?.Id === selectedType?.Id ? (item?.Name === 'Premium' ? theme.colors.custom[3].anzac : theme.colors.accent.light) : theme.colors.accent.lightGray,
                                    borderRadius: Display.setWidth(1.2),
                                    marginBottom: Display.setHeight(2),
                                    marginTop: Display.setHeight(1),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: theme.colors.primary.dark,
                                    shadowOffset: {
                                        width: 3,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 5.5,
                                    elevation: 10,
                                }}
                                onPress={() => handleSelectedType(item)}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.5),
                                        fontFamily: 'RC',
                                        fontWeight: '600',
                                        color: theme.colors.primary.dark,
                                    }}
                                >
                                    {item?.Name}
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                />
                <View
                    style={{
                        width: Display.setWidth(85),
                        height: Display.setHeight(3.5),
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(1.5),
                            fontFamily: 'RC',
                            fontWeight: '500',
                            color: theme.colors.primary.dark,
                        }}
                    >
                        {selectedType?.Name}
                    </Text>
                    {selectedType &&
                        <TouchableOpacity
                            onPress={refreshMealPlans}
                            style={{
                                width: Display.setWidth(15),
                                height: Display.setHeight(2.5),
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                zIndex: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.3),
                                    fontFamily: 'RC',
                                    fontWeight: '500',
                                    color: theme.colors.primary.dark,
                                    marginRight: Display.setWidth(1),
                                }}
                            >Regenerate</Text><MaterialCommunityIcons name="refresh" size={Display.setHeight(2.5)} color={theme.colors.custom[2].stromboli} />
                        </TouchableOpacity>
                    }
                </View>
                {
                    !selectedType &&
                    <View
                        style={{
                            width: Display.setWidth(50),
                            height: Display.setHeight(20),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: Display.setHeight(4),
                                fontFamily: 'RC',
                                fontWeight: 'bold',
                                color: theme.colors.custom[2].stromboli,
                            }}
                        >
                            Choose a plan to see your meals
                        </Text>
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: -1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.1,
                            }}
                        >
                            <MaterialCommunityIcons name="cursor-default-click" size={Display.setHeight(10)} color={theme.colors.custom[2].stromboli} />
                        </View>
                    </View>
                }
                <FlatList
                    data={mealzPeyDay}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        width: Display.setWidth(100),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    renderItem={renderItem}
                />
            </Stepper>
        </View>
    )
}

export default MealsScreen;


