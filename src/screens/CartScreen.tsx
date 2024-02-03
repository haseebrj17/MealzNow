import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Text, View, ViewStyle, Image, Dimensions, StyleSheet, SafeAreaView, FlatList, Platform } from "react-native";
import { ThemeType, theme } from "../theme/theme";
import { Display, fDateCustom } from "../utils";
import { Separator, Stepper } from "../components";
import { getDataFromTable, getDataFromTableWithLimit } from "../db/methods/common";
import { RootState } from "../Store";
import { useSelector } from "react-redux";
import { Appbar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import MN from '../assets/MN_LOGO_LG_NBG.png';
import { Entypo, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Button from '../components/Button';
import { CartService, OrderService, UserAddressService } from "../services";
import jwt_Decode from "jwt-decode";

const { width, height } = Dimensions.get('window')

interface ProductByDayDto {
    DayId: string;
    Day: string;
    DeliveryDate: string;
    ProductByTiming: ProductByTimingDto[];
}

interface ProductByTimingDto {
    TimeOfDayId: string;
    TimeOfDay: string;
    DeliveryTimings: string;
    Name: string;
    Detail: string;
    EstimatedDeliveryTime: string | number;
    SpiceLevel: number;
    Type: string;
    IngredientSummary: string;
    Image: string;
    Price: number;
    OrderedProductExtraDipping: ProductExtraDipping[] | null;
    OrderedProductExtraTopping: ProductExtraTopping[] | null;
    OrderedProductSides: [] | null;
    OrderedProductDessert: [] | null;
    OrderedProductDrinks: [] | null;
    OrderedProductChoices: ProductChoices[] | null;
}

interface Styles {
    shadow: ViewStyle;
    AppBar: ViewStyle;
}

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
    slots: SlotDetail[];
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
}

type RootStackParamList = {
    Cart: {
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[],
        packageId: string
    };
    PlaceOrder: undefined;
    Register: {
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
    AddressAccess: {
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
    OrderConfirmation: undefined;
    Profile: undefined;
};

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

interface CartScreenProps {
    navigation: CartScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Cart'>;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation, route }) => {

    const styles = getStyles(theme);

    const aspectRatio = 4265 / 1200
    const Height = Display.setHeight(4)
    const Width = Height * aspectRatio

    const { franchiseSetting, franchiseDetails, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    const { packages, products, loadingDashboard } = useSelector(
        (state: RootState) => state.dashboard
    );

    const { token } = useSelector(
        (state: RootState) => state.general
    );

    const [disabled, setDisabled] = useState<boolean>(true)
    const [timing, setTiming] = useState<string | null>(null);
    const [promo, setPromo] = useState<number | null>(null);
    const [deliveryCharge, setDeliveryCharge] = useState<number | null>(null);
    const [packageData, setPackageData] = useState<CustomerPackage>();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [promoAmount, setPromoAmount] = useState<number>(0);
    const [amountAfterPromo, setAmountAfterPromo] = useState<number>(0);
    const [totalNumberOfMeals, setTotalNumberOfMeals] = useState<number>(0);
    const [mealzPeyDay, setMealzPeyDay] = useState<MealPlan[]>([]);
    const [mealPlanCache, setMealPlanCache] = useState<{ [packageType: string]: MealPlan[] }>({});
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        generatedDates: [],
        preferredCategories: [],
        excludedIngredients: [],
        mealType: '',
    });
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userAddresses, setUserAddresses] = useState<any | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const handleSelectedType = (Id: string) => {
        setSelectedType(Id);
        setDisabled(false);
    };


    useEffect(() => {
        if (token) {
            setUserToken(token);
        }
    }, [token]);

    useEffect(() => {
        async function Addressfunction(userToken: string) {
            if (userToken) {
                try {
                    let token: any = userToken;
                    const response = await UserAddressService.getUserAddresses(token);
                    console.log(response);
                    if (response.status) {
                        setUserAddresses(response.data)
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log("User token not available");
            }
        }

        Addressfunction(userToken ?? '');
    }, [userToken]);

    useEffect(() => {
        fetchData();
    }, [route?.params?.packageId, route?.params?.generatedDates, franchiseSetting, products, totalAmount, totalNumberOfMeals]);

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
            ["percent"],
            '',
            [],
            1
        );
        const promo = promoData[0]?.percent;

        setPromo(promo);

        setTotalAmount(route?.params?.totalAmount);

        console.log('route?.params?.totalNumberOfMeals', route?.params?.totalNumberOfMeals)
        console.log('route?.params?.totalAmount', route?.params?.totalAmount)
        console.log('route?.params?.packageType', route?.params?.packageType)
        console.log('route?.params?.packageId', route?.params?.packageId)
        console.log('route?.params?.generatedDates', route?.params?.generatedDates)
        console.log('route?.params?.data', route?.params?.data)
        console.log('route?.params?.packages', route?.params?.packages);

        // Update user preferences state
        setUserPreferences({
            generatedDates: route?.params?.generatedDates ?? [],
            preferredCategories: preferredCategoriesData ?? [],
            excludedIngredients: excludedIngredientsData ?? [],
            mealType: mealType ?? 'Omnivore',
        });
    };

    useEffect(() => {
        if (promo && totalAmount && route?.params?.packageType) {

            const packageType = route?.params?.packageType;

            // Ensure both values are numbers
            const promoPercentage = Number(promo);
            const currentTotalAmount = Number(totalAmount);

            // Calculate promo amount and amount after promo
            const promoAmount = (promoPercentage * currentTotalAmount) / 100;
            const newAmountAfterPromo = currentTotalAmount - promoAmount;

            setPromoAmount(promoAmount);

            if (route?.params?.packageType?.IncludesDelivery === false) {
                const totalNumberOfMeals = packageData?.totalNumberOfMeals;
                console.log('totalNumberOfMeals', totalNumberOfMeals);
                const deliveryCharge = totalNumberOfMeals ?? 0 * 2;
                setDeliveryCharge(deliveryCharge);
            }

            setAmountAfterPromo(newAmountAfterPromo + (deliveryCharge ?? 0));
        }
    }, [promo, totalAmount, route?.params?.packageType, packageData]);

    useEffect(() => {
        console.log('totalAmount', totalAmount);
        console.log('promoAmount', promoAmount);
        console.log('deliveryCharge', deliveryCharge);
        console.log('amountAfterPromo', amountAfterPromo);

    }, [amountAfterPromo]);

    const handelOrder = async () => {
        try {
            const productByDay: ProductByDayDto[] = route?.params?.data.map((item) => {
                const timings: ProductByTimingDto[] = [];

                if (item.meals.Lunch) {
                    timings.push({
                        TimeOfDayId: item.meals.Lunch.timingId,
                        TimeOfDay: item.meals.Lunch.timing,
                        DeliveryTimings: item.meals.Lunch.timing,
                        Name: item.meals.Lunch.dish.Name,
                        Detail: item.meals.Lunch.dish.Detail,
                        EstimatedDeliveryTime: item.meals.Lunch.dish.EstimatedDeliveryTime,
                        SpiceLevel: item.meals.Lunch.dish.SpiceLevel,
                        Type: item.meals.Lunch.dish.Type,
                        IngredientSummary: item.meals.Lunch.dish.IngredientSummary,
                        Image: item.meals.Lunch.dish.Image,
                        Price: item.meals.Lunch.dish.ProductPrice[0].Price,
                        OrderedProductExtraDipping: null,
                        OrderedProductExtraTopping: null,
                        OrderedProductSides: null,
                        OrderedProductDessert: null,
                        OrderedProductDrinks: null,
                        OrderedProductChoices: null,
                    });
                }

                if (item.meals.Dinner) {
                    timings.push({
                        TimeOfDayId: item.meals.Dinner.timingId,
                        TimeOfDay: item.meals.Dinner.timing,
                        DeliveryTimings: item.meals.Dinner.timing,
                        Name: item.meals.Dinner.dish.Name,
                        Detail: item.meals.Dinner.dish.Detail,
                        EstimatedDeliveryTime: item.meals.Dinner.dish.EstimatedDeliveryTime,
                        SpiceLevel: item.meals.Dinner.dish.SpiceLevel,
                        Type: item.meals.Dinner.dish.Type,
                        IngredientSummary: item.meals.Dinner.dish.IngredientSummary,
                        Image: item.meals.Dinner.dish.Image,
                        Price: item.meals.Dinner.dish.ProductPrice[0].Price,
                        OrderedProductExtraDipping: null,
                        OrderedProductExtraTopping: null,
                        OrderedProductSides: null,
                        OrderedProductDessert: null,
                        OrderedProductDrinks: null,
                        OrderedProductChoices: null,
                    });
                }

                return {
                    DayId: item.dayId,
                    Day: item.day,
                    DeliveryDate: item.date,
                    ProductByTiming: timings,
                };
            });

            const decoded: {
                Id: string;
                FullName: string;
                EmailAddress: string;
                ContactNumber: string;
                UserRole: string;
                FranchiseId: number;
                exp: number;
                iss: string;
                aud: string;
            } = jwt_Decode(token);
            const order = {
                totalBill: amountAfterPromo,
                totalNumberOfMeals: route?.params?.totalNumberOfMeals,
                orderDeliveryDateTime: route?.params?.generatedDates[0]?.date ?? '',
                instructions: '',
                customerId: decoded?.Id,
                customerAddressId: selectedType ?? 'b6e7bcce-a2e5-4df1-6caf-08dc11b9f98e',
                franchiseId: decoded?.FranchiseId,
                OrderStatus: 'OrderPlaced',
                CustomerOrderedPackageDto: {
                    PackageId: route?.params?.packages.packageId,
                    PackageName: route?.params?.packages.packageName,
                    TotalNumberOfMeals: route?.params?.packages.totalNumberOfMeals,
                    NumberOfDays: route?.params?.packages.numberOfDays,
                    Timings: route?.params?.packages.timings,
                    NumberOfWeeks: route?.params?.packages.numberOfWeeks,
                },
                CustomerOrderPromo: {
                    Type: 'New User',
                    Name: '2 Mealz Per Day',
                    Percent: promo,
                },
                CustomerOrderPayment: {
                    PaymentType: 'Cash On Delivery',
                    OrderType: 'Deliver',
                },
                ProductByDay: productByDay,
            }

            console.log('order', order);
            const response = await OrderService.placeOrder(order, token);
            if (response) {
                navigation.navigate('OrderConfirmation');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View
            style={{
                width: Display.setWidth(100),
                height: Display.setHeight(100),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flex: 1,
                backgroundColor: theme.colors.background.bgGrayPurple
            }}
        >
            <View style={styles.AppBar}>
                <TouchableOpacity
                    style={{
                        width: Display.setHeight(4),
                        height: Display.setHeight(4),
                        borderRadius: Display.setHeight(2),
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: '7%',
                        zIndex: 1,
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign name="arrowleft" size={Display.setHeight(3)} color={theme.colors.primary.light} />
                </TouchableOpacity>
                <Image
                    style={{
                        height: Height,
                        width: Width,
                        position: 'absolute',
                        left: (width / 2) - (Width / 2),
                        bottom: '7%'
                    }}
                    source={MN}
                />
                {
                    token.length > 0 ? (
                        <TouchableOpacity
                            style={{
                                width: Display.setHeight(4),
                                height: Display.setHeight(4),
                                borderRadius: Display.setHeight(2),
                                backgroundColor: theme.colors.primary.light,
                                shadowColor: theme.colors.primary.dark,
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.35,
                                shadowRadius: 1,
                                elevation: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-end',
                                margin: theme.padding.small,
                            }}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <FontAwesome5 name="user-alt" size={Display.setHeight(2)} color={theme.colors.custom[2].stromboli} />
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )
                }
            </View>
            <View
                style={{
                    width: '100%',
                    height: Display.setHeight(100 - 30),
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    backgroundColor: theme.colors.accent.lightGray,
                }}
            >
                <Text
                    style={{
                        fontSize: Display.setHeight(3.5),
                        fontFamily: 'RC',
                        fontWeight: '700',
                        alignSelf: 'flex-start',
                        marginTop: Display.setHeight(2),
                        color: theme.colors.primary.darker,
                        paddingLeft: theme.padding.medium,
                        paddingRight: theme.padding.medium
                    }}
                >
                    Checkout
                </Text>
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        paddingLeft: theme.padding.medium,
                        marginTop: theme.padding.medium,
                        marginBottom: theme.padding.medium,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC',
                            alignSelf: 'flex-start',
                        }}
                    >Package Details</Text>
                    <Separator
                        width={Display.setWidth(90)}
                        height={Display.setHeight(0.1)}
                        color={theme.colors.accent.mediumGray}
                    />
                </View>
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-end',
                        paddingLeft: theme.padding.medium,
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginBottom: theme.padding.small,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC'
                        }}
                    >Meals: </Text>
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.4),
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >
                        {timing ? timing : ''}
                    </Text>
                </View>
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-end',
                        paddingLeft: theme.padding.medium,
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginBottom: theme.padding.small,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC'
                        }}
                    >Weeks: </Text>
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.4),
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >
                        {packageData ? packageData.numberOfWeeks : ''}
                    </Text>
                </View>
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-end',
                        paddingLeft: theme.padding.medium,
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginBottom: theme.padding.small,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC'
                        }}
                    >Days per week: </Text>
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.4),
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >
                        {packageData ? packageData.numberOfDays : ''}
                    </Text>
                </View>
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-end',
                        paddingLeft: theme.padding.medium,
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginBottom: theme.padding.medium,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC'
                        }}
                    >Starting Date: </Text>
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.4),
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >
                        {userPreferences ? fDateCustom(userPreferences?.generatedDates[0]?.date) : ''}
                    </Text>
                </View>
                <Separator
                    width={Display.setWidth(90)}
                    height={Display.setHeight(0.1)}
                    color={theme.colors.accent.mediumGray}
                />
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-end',
                        paddingLeft: theme.padding.medium,
                        marginTop: theme.padding.small,
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginBottom: theme.padding.small,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC'
                        }}
                    >Total Amount: </Text>
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.4),
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >
                        €{route?.params?.totalAmount ? route?.params?.totalAmount : ''}
                    </Text>
                </View>
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-end',
                        paddingLeft: theme.padding.medium,
                        marginTop: theme.padding.medium,
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        marginBottom: theme.padding.small,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC'
                        }}
                    >Discount: </Text>
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.4),
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >
                        €{promoAmount ? promoAmount : 0}
                    </Text>
                </View>
                <Separator
                    width={Display.setWidth(90)}
                    height={Display.setHeight(0.1)}
                    color={theme.colors.accent.mediumGray}
                />
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-end',
                        paddingLeft: theme.padding.medium,
                        marginTop: theme.padding.medium,
                        flexDirection: 'row',
                        marginBottom: theme.padding.small,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.7),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC'
                        }}
                    >Grand Total: </Text>
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.6),
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >
                        €{amountAfterPromo ? amountAfterPromo : route?.params?.totalAmount}
                    </Text>
                </View>
                <Separator
                    width={Display.setWidth(90)}
                    height={Display.setHeight(0.1)}
                    color={theme.colors.accent.mediumGray}
                />
                <View
                    style={{
                        width: Display.setWidth(100),
                        alignItems: 'flex-start',
                        paddingLeft: theme.padding.medium,
                        marginTop: theme.padding.medium,
                        justifyContent: 'center',
                        flexDirection: 'column',
                        marginBottom: theme.padding.small,
                    }}
                >
                    <View
                        style={{
                            width: Display.setWidth(90),
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            marginBottom: theme.padding.small,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Display.setHeight(2.7),
                                color: theme.colors.primary.dark,
                                fontFamily: 'RC'
                            }}
                        >Addresses: </Text>
                        <TouchableOpacity
                            style={{
                                width: Display.setHeight(5),
                                height: Display.setHeight(5),
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'visible'
                            }}
                            onPress={() => navigation.navigate('AddressAccess', {
                                data: route?.params?.data,
                                packages: route?.params?.packages,
                                packageType: route?.params?.packageType,
                                totalAmount: route?.params?.totalAmount,
                                totalNumberOfMeals: route?.params?.totalNumberOfMeals,
                                generatedDates: route?.params?.generatedDates,
                                packageId: route?.params?.packageId
                            })}
                        >
                            <View
                                style={{
                                    width: Display.setHeight(3),
                                    height: Display.setHeight(3),
                                    borderRadius: Display.setHeight(3),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: theme.colors.accent.lightGray,
                                    shadowColor: theme.colors.primary.dark,
                                    shadowOffset: {
                                        width: 0,
                                        height: 1,
                                    },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 1,
                                    elevation: 4,
                                }}
                            >
                                <Entypo name="plus" size={Display.setHeight(3)} color={theme.colors.custom[2].stromboli} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={userAddresses}
                        style={{
                            width: Display.setWidth(90),
                            marginBottom: theme.padding.small,
                            marginTop: theme.padding.small
                        }}
                        contentContainerStyle={{
                            alignItems: 'center',
                        }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={item.Id + index}
                                style={{
                                    width: Display.setWidth(80),
                                    height: Display.setHeight(8),
                                    alignItems: 'flex-start',
                                    padding: theme.padding.small,
                                    paddingLeft: theme.padding.medium,
                                    justifyContent: 'flex-start',
                                    flexDirection: 'column',
                                    marginBottom: theme.padding.small,
                                    shadowColor: theme.colors.primary.dark,
                                    shadowOffset: {
                                        width: 2,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 5.5,
                                    elevation: 9,
                                    borderRadius: Display.setHeight(1.5),
                                    backgroundColor: item.Id === selectedType ? theme.colors.accent.light : theme.colors.accent.lightGray,
                                }}
                                onPress={() => handleSelectedType(item?.Id)}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(2.4),
                                        fontFamily: 'RC',
                                        color: theme.colors.custom[2].stromboli,
                                    }}
                                >
                                    {item.CityName}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.7),
                                        fontFamily: 'RC',
                                        color: theme.colors.accent.disabledGray,
                                    }}
                                >
                                    {item.StreetAddress}, {item.House}, {item?.District}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.addressId}
                    />
                </View>
            </View>
            <View
                style={{
                    width: '100%',
                    height: Display.setHeight(14),
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: '0%',
                    backgroundColor: theme.colors.accent.lightGray,
                    borderTopLeftRadius: Display.setHeight(1.5),
                    borderTopRightRadius: Display.setHeight(1.5),
                    shadowColor: theme.colors.primary.dark,
                    shadowOffset: {
                        width: 4,
                        height: -4,
                    },
                    shadowOpacity: 0.35,
                    shadowRadius: 5.5,
                    elevation: 9,
                }}
            >
                <ConditionalRender
                    condition={token.length > 0}
                    data={route?.params?.data}
                    packages={route?.params?.packages}
                    packageType={route?.params?.packageType}
                    totalAmount={route?.params?.totalAmount}
                    totalNumberOfMeals={route?.params?.totalNumberOfMeals}
                    generatedDates={route?.params?.generatedDates}
                    packageId={route?.params?.packageId}
                    navigation={navigation}
                    handelNext={() => handelOrder()}
                />
            </View>
        </View>
    )
}

const ConditionalRender = ({
    condition,
    navigation,
    data,
    packages,
    packageType,
    totalAmount,
    totalNumberOfMeals,
    generatedDates,
    packageId,
    handelNext
}: {
    condition: boolean,
    navigation: CartScreenNavigationProp
    data: MealPlan[],
    packages: CustomerPackage,
    packageType: Package,
    totalAmount: number,
    totalNumberOfMeals: number,
    generatedDates: DayWithDateAndSlots[] | null,
    packageId: string
    handelNext: () => void
}) => {
    return (
        <>
            {
                condition ?
                    <Button
                        width={Display.setWidth(90)}
                        height={Display.setHeight(5)}
                        onPress={handelNext}
                        title={'Place Order'}
                        color={theme.colors.primary.darker}
                        textColor={theme.colors.custom[4].snuff}
                        disabled={false}
                    />
                    :
                    <Button
                        width={Display.setWidth(90)}
                        height={Display.setHeight(5)}
                        onPress={() => navigation.navigate('Register', {
                            data: data,
                            packages: packages,
                            packageType: packageType,
                            totalAmount: totalAmount,
                            totalNumberOfMeals: totalNumberOfMeals,
                            generatedDates: generatedDates ?? [],
                            packageId: packageId
                        })}
                        title={'Sign Up to Checkout'}
                        color={theme.colors.primary.darker}
                        textColor={theme.colors.custom[4].snuff}
                        disabled={false}
                    />
            }
        </>
    )
}


const getStyles = (theme: ThemeType): StyleSheet.NamedStyles<Styles> => StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: theme.colors.accent.medium,
    //     padding: 20,
    // },
    // header: {
    //     fontSize: 20,
    //     color: theme.colors.primary.dark,
    //     marginBottom: 10,
    // },
    // button: {
    //     backgroundColor: theme.colors.primary.light,
    //     padding: 15,
    //     borderRadius: 5,
    // },
    // buttonText: {
    //     color: theme.colors.white,
    //     textAlign: 'center',
    // },
    // secondaryText: {
    //     color: theme.colors.secondary.darkGray,
    // },
    shadow: {
        shadowColor: theme.colors.primary.dark,
        shadowOffset: {
            width: 2,
            height: 10,
        },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 6,
    },
    AppBar: {
        backgroundColor: theme.colors.primary.dark,
        height: Display.setHeight(12),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingLeft: theme.padding.medium,
        paddingRight: theme.padding.medium
    }
});


export default CartScreen;