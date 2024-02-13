import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Text, View, ViewStyle, Image, Dimensions, StyleSheet, SafeAreaView, FlatList, Platform } from "react-native";
import { ThemeType, theme } from "../theme/theme";
import { Display, fDateCustom } from "../utils";
import { Separator, Stepper } from "../components";
import { RootState } from "../Store";
import { useDispatch, useSelector } from "react-redux";
import { Appbar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import MN from '../assets/MN_LOGO_LG_NBG.png';
import { Entypo, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Button from '../components/Button';
import { CartService, OrderService, UserAddressService } from "../services";
import jwt_Decode from "jwt-decode";
import { DayWithDateAndSlots } from '../types/temp';
import { Dish, MealPlan, UserPreferences } from '../types/meal';
import { CustomerPackage } from '../types/customer';
import { ProductByDay } from '../types/cart';
import { Styles } from "../types/common";
import { updateCustomerInfo } from "src/features/cart/cartSlice";

const { width, height } = Dimensions.get('window')

type RootStackParamList = {
    Cart: undefined;
    PlaceOrder: undefined;
    Register: undefined;
    AddressAccess: undefined;
    OrderConfirmation: undefined;
    Profile: undefined;
};

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Cart'>;

interface CartScreenProps {
    navigation: CartScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Cart'>;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();

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

    const { token, userData } = useSelector(
        (state: RootState) => state.general
    );

    const { generatedDates, packageType } = useSelector(
        (state: RootState) => state.temp
    );

    const { customer } = useSelector(
        (state: RootState) => state.customer
    );

    const { totalBill, totalItems, productByDay } = useSelector(
        (state: RootState) => state.cart
    );

    const cart = useSelector(
        (state: RootState) => state.cart
    );

    useEffect(() => {
        console.log(cart)
    }, [cart]);

    const [disabled, setDisabled] = useState<boolean>(true)
    const [timing, setTiming] = useState<string | null>(null);
    const [promo, setPromo] = useState<string | null>(null);
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
        packageType: ''
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
    }, [generatedDates, customer, franchiseSetting, products, totalAmount, totalNumberOfMeals]);

    const fetchData = async () => {
        if (customer && totalBill) {
            setTotalAmount(totalBill);

            setPackageData(customer.customerPackage);
            const timingString = franchiseSetting?.MealsPerDay.find(meal => meal.Timings === customer.customerPackage.timings)?.Title ?? null;
            setTiming(timingString);

            setPromo(customer.customerPromo?.percent ?? null);

            const excludedIngredientsIds = customer.customerProductOutline.customerProductInclusion?.map(inclusion => inclusion.inclusionId);

            setUserPreferences({
                generatedDates: generatedDates ?? [],
                preferredCategories: customer.preference?.preferredCategories ?? [],
                excludedIngredients: excludedIngredientsIds ?? [],
                mealType: customer.customerProductOutline.title ?? 'Omnivore',
                packageType: ''
            });
        }
    };

    useEffect(() => {
        if (promo && totalAmount && packageType) {
            const promoPercentage = Number(promo);
            const currentTotalAmount = Number(totalAmount);

            const promoAmount = (promoPercentage * currentTotalAmount) / 100;
            const newAmountAfterPromo = currentTotalAmount - promoAmount;

            setPromoAmount(promoAmount);

            if (packageType?.IncludesDelivery === false) {
                const totalNumberOfMeals = packageData?.totalNumberOfMeals;
                console.log('totalNumberOfMeals', totalNumberOfMeals);
                const deliveryCharge = totalNumberOfMeals ?? 0 * 2;
                setDeliveryCharge(deliveryCharge);
            }

            setAmountAfterPromo(newAmountAfterPromo + (deliveryCharge ?? 0));
        }
    }, [promo, totalAmount, packageType, packageData]);

    const handelOrder = async () => {

        //     try {
        //         const productByDays: ProductByDayDto[] = productByDay.map((item) => {
        //             const timings: ProductByTimingDto[] = [];

        //             if (item.meals.Lunch) {
        //                 timings.push({
        //                     TimeOfDayId: item.meals.Lunch.timingId,
        //                     TimeOfDay: item.meals.Lunch.timing,
        //                     DeliveryTimings: item.meals.Lunch.timing,
        //                     Name: item.meals.Lunch.dish.Name,
        //                     Detail: item.meals.Lunch.dish.Detail,
        //                     EstimatedDeliveryTime: item.meals.Lunch.dish.EstimatedDeliveryTime,
        //                     SpiceLevel: item.meals.Lunch.dish.SpiceLevel,
        //                     Type: item.meals.Lunch.dish.Type,
        //                     IngredientSummary: item.meals.Lunch.dish.IngredientSummary,
        //                     Image: item.meals.Lunch.dish.Image,
        //                     Price: item.meals.Lunch.dish.ProductPrice[0].Price,
        //                     OrderedProductExtraDipping: null,
        //                     OrderedProductExtraTopping: null,
        //                     OrderedProductSides: null,
        //                     OrderedProductDessert: null,
        //                     OrderedProductDrinks: null,
        //                     OrderedProductChoices: null,
        //                 });
        //             }

        //             if (item.meals.Dinner) {
        //                 timings.push({
        //                     TimeOfDayId: item.meals.Dinner.timingId,
        //                     TimeOfDay: item.meals.Dinner.timing,
        //                     DeliveryTimings: item.meals.Dinner.timing,
        //                     Name: item.meals.Dinner.dish.Name,
        //                     Detail: item.meals.Dinner.dish.Detail,
        //                     EstimatedDeliveryTime: item.meals.Dinner.dish.EstimatedDeliveryTime,
        //                     SpiceLevel: item.meals.Dinner.dish.SpiceLevel,
        //                     Type: item.meals.Dinner.dish.Type,
        //                     IngredientSummary: item.meals.Dinner.dish.IngredientSummary,
        //                     Image: item.meals.Dinner.dish.Image,
        //                     Price: item.meals.Dinner.dish.ProductPrice[0].Price,
        //                     OrderedProductExtraDipping: null,
        //                     OrderedProductExtraTopping: null,
        //                     OrderedProductSides: null,
        //                     OrderedProductDessert: null,
        //                     OrderedProductDrinks: null,
        //                     OrderedProductChoices: null,
        //                 });
        //             }

        //             return {
        //                 DayId: item.dayId,
        //                 Day: item.day,
        //                 DeliveryDate: item.date,
        //                 ProductByTiming: timings,
        //             };
        //         });

        //         const decoded: {
        //             Id: string;
        //             FullName: string;
        //             EmailAddress: string;
        //             ContactNumber: string;
        //             UserRole: string;
        //             FranchiseId: number;
        //             exp: number;
        //             iss: string;
        //             aud: string;
        //         } = jwt_Decode(token);
        //         const order = {
        //             totalBill: amountAfterPromo,
        //             totalNumberOfMeals: route?.params?.totalNumberOfMeals,
        //             orderDeliveryDateTime: route?.params?.generatedDates[0]?.date ?? '',
        //             instructions: '',
        //             customerId: decoded?.Id,
        //             customerAddressId: selectedType ?? 'b6e7bcce-a2e5-4df1-6caf-08dc11b9f98e',
        //             franchiseId: decoded?.FranchiseId,
        //             OrderStatus: 'OrderPlaced',
        //             CustomerOrderedPackageDto: {
        //                 PackageId: route?.params?.packages.packageId,
        //                 PackageName: route?.params?.packages.packageName,
        //                 TotalNumberOfMeals: route?.params?.packages.totalNumberOfMeals,
        //                 NumberOfDays: route?.params?.packages.numberOfDays,
        //                 Timings: route?.params?.packages.timings,
        //                 NumberOfWeeks: route?.params?.packages.numberOfWeeks,
        //             },
        //             CustomerOrderPromo: {
        //                 Type: 'New User',
        //                 Name: '2 Mealz Per Day',
        //                 Percent: promo,
        //             },
        //             CustomerOrderPayment: {
        //                 PaymentType: 'Cash On Delivery',
        //                 OrderType: 'Deliver',
        //             },
        //             ProductByDay: productByDay,
        //         }

        //         console.log('order', order);
        //         const response = await OrderService.placeOrder(order, token);
        //         if (response) {
        //             navigation.navigate('OrderConfirmation');
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
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
                        €{totalBill ? totalBill : ''}
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
                        €{amountAfterPromo ? amountAfterPromo : totalBill}
                    </Text>
                </View>
                <Separator
                    width={Display.setWidth(90)}
                    height={Display.setHeight(0.1)}
                    color={theme.colors.accent.mediumGray}
                />
                {
                    token.length > 0 ? (
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
                                    onPress={() => navigation.navigate('AddressAccess')}
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
                    ) : (
                        <></>
                    )
                }
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
    handelNext
}: {
    condition: boolean,
    navigation: CartScreenNavigationProp
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
                        onPress={() => navigation.navigate('Register')}
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