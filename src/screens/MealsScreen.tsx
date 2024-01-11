import { View, Text, TouchableOpacity, Image, FlatList, Button, Dimensions, Platform } from 'react-native'
import React, { Children, useEffect, useRef, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'; // or NavigationProp from '@react-navigation/native'
import { Separator, Stepper } from '../components'
import { theme } from '../theme/theme';
import { useFonts } from '../hooks/useFonts';
import { Display, fDateCustom, transformImageUrl } from '../utils';
import Vegetarian from '../assets/icons/Vegetarian';
import Omnivore from '../assets/icons/Omnivore';
import { useDispatch, useSelector } from 'react-redux';
import { setFlashMessage } from '../features/flashMessages/flashMessageSlice';
import FlashMessage from '../components/flashMessage';
import { MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { logAllTables } from '../db/DataLog';
import { RouteProp } from '@react-navigation/native';
import { RootState } from '../Store';
import { getDataFromTable, getDataFromTableWithLimit } from '../db/methods/common';
import LottieView from 'lottie-react-native';
import { createMealPlan } from '../components/DishAlgorithm';
import { getImageAspectRatioWithCallBack } from '../utils/ImageAspect';
import Modal from "react-native-modal";
import { ScrollView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { number } from 'prop-types';
import { createNewDayAndGetId, insertProductByTiming } from '../db/methods/cartNestedOperations';
import { insertIntoCart } from '../db/methods/cartOperations';
import { dropAllTables } from '../db/DropData';

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

interface CustomerPackage {
    packageId: string;
    packageName: string;
    totalNumberOfMeals: number;
    numberOfDays: number;
    timings: number;
    numberOfWeeks: number;
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

interface SlotDetail {
    Id: string;
    Time: string;
}

interface DayWithDateAndSlots extends DayWithDate {
    dayId: string;
    slots: MealSelection;
}

interface MealSelection {
    Lunch?: SlotDetail;
    Dinner?: SlotDetail;
}

interface MealPlan {
    dayId: string;
    day: string;
    date: string;
    meals: MealsForTheDay;
}

interface MealsForTheDay {
    [key: string]: MealDetails | undefined;
    Lunch?: MealDetails;
    Dinner?: MealDetails;
}

interface MealDetails {
    timing: string;
    timingId: string;
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

interface UserPreferences {
    generatedDates: DayWithDateAndSlots[];
    preferredCategories: Array<{ categoryId: string; categoryName: string }>;
    excludedIngredients: string[];
    mealType: string;
    packageType: string;
}

type RootStackParamList = {
    Meals: {
        packageId: string | null,
        generatedDates: DayWithDateAndSlots[] | null
    };
    Cart: {
        data: MealPlan[],
        packages: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string | null
        packageType: Package | null
    };
};

type MealsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Meals'>;

interface MealsScreenProps {
    navigation: MealsScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Meals'>;
}

const deviceWidth = Dimensions.get("window").width;
const deviceHeight =
    Platform.OS === "ios"
        ? Dimensions.get("window").height
        : require("react-native-extra-dimensions-android").get(
            "REAL_WINDOW_HEIGHT"
        );

interface Props {
    popoverVisible: boolean;
    setPopoverVisible: React.Dispatch<React.SetStateAction<boolean>>;
    item?: Dish;
    initialRef: React.RefObject<any>;
}

const ModalContent = ({ popoverVisible, setPopoverVisible, item, initialRef }: Props) => {
    let aspectRatio = 3024 / 2095;
    return (
        <Modal
            ref={initialRef}
            key={item?.Id}
            isVisible={popoverVisible}
            onBackdropPress={() => setPopoverVisible(false)}
            onSwipeComplete={() => setPopoverVisible(false)}
            swipeDirection="down"
            backdropOpacity={0.1}
            animationIn="slideInUp"
            animationInTiming={500}
            animationOutTiming={500}
            backdropTransitionInTiming={500}
            backdropTransitionOutTiming={500}
            deviceHeight={deviceHeight}
            deviceWidth={deviceWidth}
            style={{
                justifyContent: 'center',
                margin: 0, // Ensure there are no additional margins
            }}
        >
            <View style={{
                backgroundColor: theme.colors.accent.lightGray,
                borderRadius: Display.setWidth(3),
                width: Display.setWidth(80),
                height: Display.setHeight(77),
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View
                    style={{
                        width: Display.setWidth(80),
                        height: Display.setHeight(7),
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: theme.padding.medium,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            fontWeight: '500',
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >{item?.Name}</Text>
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(5),
                            height: Display.setWidth(5),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => setPopoverVisible(false)}
                    >
                        <Entypo name="cross" size={Display.setHeight(2.5)} color={theme.colors.custom[2].stromboli} />
                    </TouchableOpacity>
                </View>
                <Separator width={Display.setWidth(80)} color={theme.colors.accent.mediumGray} height={Display.setHeight(0.2)} />
                <View
                    style={{
                        width: Display.setWidth(80),
                        height: Display.setHeight(70),
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        padding: theme.padding.medium,
                    }}
                >
                    <Image
                        source={{ uri: transformImageUrl({ originalUrl: item?.Image ? item?.Image : '', size: '/tr:w-400' }) }}
                        style={{
                            width: Display.setWidth(70),
                            borderRadius: Display.setWidth(3),
                            alignSelf: 'center',
                            height: 'auto',
                            aspectRatio: aspectRatio,
                            resizeMode: 'contain',
                        }}
                    />
                    <View
                        style={{
                            width: Display.setWidth(60),
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: Display.setHeight(1),
                            padding: theme.padding.small,
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.6),
                                    fontWeight: '600',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.darkGray,
                                }}
                            >Details</Text>
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.4),
                                    fontWeight: '500',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.textGray,
                                    marginTop: Display.setHeight(0.5),
                                }}
                            >{item?.Detail}</Text>
                        </View>
                        {item?.ProductAllergy?.length != 0 &&
                            <View
                                style={{
                                    marginTop: Display.setHeight(1),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.6),
                                        fontWeight: '600',
                                        fontFamily: 'RC',
                                        color: theme.colors.accent.darkGray,
                                    }}
                                >Allergien</Text>
                                {item?.ProductAllergy?.map((allergy, index) => {
                                    return (
                                        <Text
                                            key={allergy.AllergyName + index}
                                            style={{
                                                fontSize: Display.setHeight(1.4),
                                                fontWeight: '500',
                                                fontFamily: 'RC',
                                                color: theme.colors.accent.textGray,
                                                marginTop: Display.setHeight(0.5),
                                            }}
                                        >{allergy?.AllergyName}</Text>
                                    )
                                })}
                            </View>
                        }
                        <View
                            style={{
                                marginTop: Display.setHeight(1),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.6),
                                    fontWeight: '600',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.darkGray,
                                }}
                            >Ingregients</Text>
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.4),
                                    fontWeight: '500',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.textGray,
                                    marginTop: Display.setHeight(0.5),
                                }}
                            >{item?.IngredientSummary}</Text>
                        </View>
                        {item?.ProductPrice?.length != 0 &&
                            <View
                                style={{
                                    marginTop: Display.setHeight(1),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.6),
                                        fontWeight: '600',
                                        fontFamily: 'RC',
                                        color: theme.colors.accent.darkGray,
                                    }}
                                >Price</Text>
                                {item?.ProductPrice?.map((price, index) => {
                                    return (
                                        <View
                                            key={price.Name + index}
                                            style={{
                                                width: Display.setWidth(16),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: Display.setHeight(1.5),
                                                    fontWeight: '500',
                                                    fontFamily: 'RC',
                                                    color: theme.colors.accent.textGray,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                            >{price?.Name}:</Text>
                                            <Text
                                                style={{
                                                    fontSize: Display.setHeight(1.4),
                                                    fontWeight: '500',
                                                    fontFamily: 'RC',
                                                    color: theme.colors.accent.textGray,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                            >{price?.Price}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        }
                        {item?.ProductChoices?.length != 0 &&
                            <View
                                style={{
                                    marginTop: Display.setHeight(1),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.6),
                                        fontWeight: '600',
                                        fontFamily: 'RC',
                                        color: theme.colors.accent.darkGray,
                                    }}
                                >Sides</Text>
                                {item?.ProductChoices?.map((productChoices, index) => {
                                    return (
                                        <Text
                                            key={productChoices?.Name + index}
                                            style={{
                                                fontSize: Display.setHeight(1.4),
                                                fontWeight: '500',
                                                fontFamily: 'RC',
                                                color: theme.colors.accent.textGray,
                                                marginTop: Display.setHeight(0.5),
                                            }}
                                        >{productChoices?.Name}</Text>
                                    )
                                })}
                            </View>
                        }
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const MealsScreen: React.FC<MealsScreenProps> = ({ navigation, route }) => {

    useEffect(() => {
        logAllTables();
    }, []);

    const { franchiseSetting, franchiseDetails, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    const { packages, products, loadingDashboard } = useSelector(
        (state: RootState) => state.dashboard
    );

    const [selectedType, setSelectedType] = useState<any | null>(null);
    const [disabled, setDisabled] = useState(true)
    const [timing, setTiming] = useState<string | null>(null);
    const [promoId, setPromoId] = useState<string | null>(null);
    const [packageData, setPackageData] = useState<CustomerPackage>();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [totalNumberOfMeals, setTotalNumberOfMeals] = useState<number>(0);
    const [mealzPeyDay, setMealzPeyDay] = useState<MealPlan[]>([]);
    const [mealPlanCache, setMealPlanCache] = useState<{ [packageType: string]: MealPlan[] }>({});
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
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
            // console.log('Loading meal plans from cache for package type:', selectedType?.Name);
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
        // console.log('Forcibly refreshing meal plans for package type:', selectedType?.Name);

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
        if (packageData && packageData.length > 0) {
            const packageDataItem = packageData[0];
            setPackageData(packageDataItem);

            const timingString = franchiseSetting?.MealsPerDay.find(meal => meal.Timings === packageDataItem.timings)?.Title ?? null;
            setTiming(timingString);
        }

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

        const promoData = await getDataFromTableWithLimit(
            "CustomerOrderPromo",
            ["promoId"],
            '',
            [],
            1
        );
        const promoId = promoData[0]?.promoId;

        setPromoId(promoId);

        console.log('route?.params?.generatedDates', route?.params?.generatedDates);

        // Update user preferences state
        setUserPreferences({
            generatedDates: route?.params?.generatedDates ?? [],
            preferredCategories: preferredCategoriesData ?? [],
            excludedIngredients: excludedIngredientsData ?? [],
            mealType: mealType ?? 'Omnivore',
            packageType: selectedType?.Name ?? 'Basic'
        });
        // console.log('userPreferences', userPreferences.generatedDates[0].slots[0]);

        if (products.length > 0) {
            loadMealPlans();
        }

        setDishes(products)
    };

    useEffect(() => {
        let totalMealz = 0;

        if (packageData && packages) {
            mealzPeyDay.forEach((item) => {
                if (item.meals.Lunch?.dish) {
                    totalMealz += 1;
                }
                if (item.meals.Dinner?.dish) {
                    totalMealz += 1;
                }
            });

            const packagePrice = packages.find(item => item?.Name === selectedType?.Name)?.Price || 0;
            if (packagePrice != 0) {
                const totalAmount = totalMealz * packagePrice;
                setTotalAmount(totalAmount);
                // console.log('totalAmount', totalAmount);
            }
        }
        setTotalNumberOfMeals(totalMealz);
        console.log(mealzPeyDay);
    }, [mealzPeyDay, packageData, packages, selectedType]);

    const [popoverLunchVisible, setPopoverLunchVisible] = useState<boolean>(false);
    const [popoverDinnerVisible, setPopoverDinnerVisible] = useState<boolean>(false);
    const [currentDishLunch, setCurrentDishLunch] = useState<Dish>();
    const [currentDishDinner, setCurrentDishDinner] = useState<Dish>();

    const initialRefLunch = useRef<TouchableOpacity>(null);
    const initialRefDinner = useRef<TouchableOpacity>(null);

    const showPopoverLunch = (item: Dish) => {
        setCurrentDishLunch(item);
        if (currentDishLunch?.Id === item.Id) {
            setPopoverLunchVisible(true);
        }
        setTimeout(() => {
            setPopoverLunchVisible(true);
        }, 1000);
    };

    const showPopoverDinner = (item: Dish) => {
        setCurrentDishDinner(item);
        if (currentDishDinner?.Id === item.Id) {
            setPopoverDinnerVisible(true);
        }
        setTimeout(() => {
            setPopoverDinnerVisible(true);
        }, 1000);
    };

    const renderItem = ({ item, index }: { item: MealPlan, index: number }) => {

        let aspectRatio = 3024 / 2095;

        return (
            <View
                style={{
                    width: Display.setWidth(90),
                    height: Display.setHeight(24),
                    backgroundColor: theme.colors.accent.lighter,
                    borderRadius: Display.setWidth(3),
                    marginBottom: Display.setHeight(3),
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
                <View
                    style={{
                        width: Display.setWidth(90),
                        height: Display.setHeight(4),
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
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
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(14),
                            height: Display.setHeight(3),
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <AntDesign name="edit" size={Display.setHeight(2.5)} color={theme.colors.primary.dark} />
                        <Text
                            style={{
                                fontSize: Display.setHeight(1.3),
                                fontWeight: '500',
                                fontFamily: 'RC',
                                color: theme.colors.primary.dark,
                            }}
                        >Edit</Text>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: Display.setWidth(90),
                        height: Display.setHeight(16),
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}
                >
                    {item?.meals?.Lunch ? (
                        <>
                            <TouchableOpacity
                                key={item.meals.Lunch?.dish.Id}
                                style={{
                                    paddingRight: theme.padding.small,
                                    paddingLeft: theme.padding.medium,
                                    marginTop: Display.setHeight(1),
                                    width: Display.setWidth(45),
                                    height: Display.setHeight(16),
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                }}
                                onPress={() => item?.meals?.Lunch?.dish && showPopoverLunch(item?.meals?.Lunch?.dish)}
                                ref={initialRefLunch}
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
                                >{item?.meals?.Lunch?.dish.Name}</Text>
                                <Image
                                    source={{ uri: transformImageUrl({ originalUrl: item?.meals?.Lunch?.dish?.Image, size: '/tr:w-200' }) }}
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
                            </TouchableOpacity>
                            <ModalContent
                                popoverVisible={popoverLunchVisible}
                                setPopoverVisible={setPopoverLunchVisible}
                                item={currentDishLunch}
                                initialRef={initialRefLunch}
                            />
                        </>
                    ) : (
                        <>
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
                                >Dish doesn't exists.</Text>
                                <View
                                    style={{
                                        width: Display.setWidth(30),
                                        borderRadius: Display.setWidth(3),
                                        height: 'auto',
                                        aspectRatio: aspectRatio,
                                        backgroundColor: theme.colors.accent.mediumGray,
                                        position: 'absolute',
                                        left: theme.padding.medium,
                                        bottom: -Display.setHeight(1),
                                    }}
                                />
                            </View>
                            <BlurView
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 10,
                                    bottom: 0,
                                    right: 0,
                                    width: Display.setWidth(42),
                                    height: Display.setHeight(18),
                                }}
                                tint="light"
                                intensity={20}
                            />
                        </>
                    )
                    }
                    {item?.meals?.Dinner ? (
                        <>
                            <TouchableOpacity
                                key={item.meals.Dinner?.dish.Id}
                                style={{
                                    paddingRight: theme.padding.medium,
                                    paddingLeft: theme.padding.small,
                                    marginTop: Display.setHeight(1),
                                    width: Display.setWidth(45),
                                    height: Display.setHeight(16),
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                }}
                                onPress={() => item.meals.Dinner?.dish && showPopoverDinner(item.meals.Dinner.dish)}
                                ref={initialRefDinner}
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
                            </TouchableOpacity>
                            <ModalContent
                                popoverVisible={popoverDinnerVisible}
                                setPopoverVisible={setPopoverDinnerVisible}
                                item={currentDishDinner}
                                initialRef={initialRefDinner}
                            />
                        </>
                    ) : (
                        <>
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
                                >Dish doesn't exists.</Text>
                                <View
                                    style={{
                                        width: Display.setWidth(30),
                                        borderRadius: Display.setWidth(3),
                                        height: 'auto',
                                        aspectRatio: aspectRatio,
                                        backgroundColor: theme.colors.accent.mediumGray,
                                        position: 'absolute',
                                        left: theme.padding.medium,
                                        bottom: -Display.setHeight(1),
                                    }}
                                />
                            </View>
                            <BlurView
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: '50%',
                                    bottom: 0,
                                    right: 0,
                                    width: Display.setWidth(42),
                                    height: Display.setHeight(18),
                                }}
                                tint="light"
                                intensity={20}
                            />
                        </>
                    )
                    }
                </View>
            </View >
        )
    }

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
                onPress={() => navigation.navigate('Cart', {
                    data: mealzPeyDay,
                    packages: selectedType,
                    totalAmount: totalAmount,
                    totalNumberOfMeals: totalNumberOfMeals,
                    generatedDates: route?.params?.generatedDates,
                    packageId: route?.params?.packageId,
                    packageType: selectedType
                })}
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
                        marginTop: Display.setWidth(0),
                        marginBottom: Display.setWidth(0),
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    zIndex: 10,
                                    width: Display.setWidth(22),
                                    height: Display.setHeight(3),
                                    backgroundColor: item?.Id === selectedType?.Id ? (item?.Name === 'Premium' ? theme.colors.custom[3].anzac : theme.colors.accent.light) : theme.colors.accent.lightGray,
                                    borderRadius: Display.setWidth(1.2),
                                    marginBottom: Display.setHeight(2),
                                    marginTop: Display.setHeight(1),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: theme.colors.primary.dark,
                                    shadowOffset: {
                                        width: 3,
                                        height: 4,
                                    },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 3,
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
                        height: Display.setHeight(5),
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                    }}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(2),
                                    fontFamily: 'RC',
                                    fontWeight: '500',
                                    color: theme.colors.custom[2].stromboli,
                                }}
                            >
                                €{totalAmount ? totalAmount : 0}
                            </Text>
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.5),
                                    fontFamily: 'RC',
                                    fontWeight: '500',
                                    color: theme.colors.primary.dark,
                                    lineHeight: Display.setHeight(2),
                                }}
                            >
                                /{totalNumberOfMeals} meals
                            </Text>
                        </View>
                        {packageData !== undefined &&
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.8),
                                    fontFamily: 'RC',
                                    fontWeight: '500',
                                    color: theme.colors.primary.dark,
                                }}
                            >
                                {packageData.numberOfDays * packageData.numberOfWeeks} days over {packageData?.numberOfWeeks} weeks
                            </Text>
                        }
                    </View>
                    {selectedType &&
                        <TouchableOpacity
                            onPress={refreshMealPlans}
                            style={{
                                width: Display.setWidth(15),
                                height: Display.setHeight(5),
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
                    keyExtractor={(item, index) => item.date + index.toString()}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={true}
                    contentContainerStyle={{
                        width: Display.setWidth(100),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    renderItem={renderItem}
                />
            </Stepper >
        </View >
    )
}

export default MealsScreen;