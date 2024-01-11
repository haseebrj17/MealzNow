import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
    MealTypeScreen,
    AllergiesScreen,
    PreferredCuisineScreen,
    MealPerDayScreen,
    DeliveriesPerWeekScreen,
    MealsScreen,
    StartDateAndSlotsScreen,
    PreferredCategoriesScreen,
    CartScreen,
    RegisterScreen,
    AddressAccessScreen,
    AddressDetailScreen,
    LoginScreen,
    HomeScreen,
    OrderConfirmationScreen,
    ProfileScreen,
    SplashScreen,
} from "../screens";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Store";
import React, { useEffect } from "react";
import { appStart } from "../features/general/generalSlice";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "transparent",
    },
};

const Stack = createStackNavigator();

const Navigators = () => {
    const { isAppLoading, isFirstTimeUse } = useSelector((state) => state?.general);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(appStart());
    }, []);

    if (isAppLoading) {
        return (
            <NavigationContainer theme={theme}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="MealType" component={MealTypeScreen} />
                <Stack.Screen name="Allergies" component={AllergiesScreen} />
                <Stack.Screen name="PreferredCuisine" component={PreferredCuisineScreen} />
                <Stack.Screen name="PreferredCategories" component={PreferredCategoriesScreen} />
                <Stack.Screen name="MealPerDay" component={MealPerDayScreen} />
                <Stack.Screen name="DeliveriesPerWeek" component={DeliveriesPerWeekScreen} />
                <Stack.Screen name="StartDateAndSlots" component={StartDateAndSlotsScreen} />
                <Stack.Screen name="Meals" component={MealsScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="AddressAccess" component={AddressAccessScreen} />
                <Stack.Screen name="AddressDetail" component={AddressDetailScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const mapStateToProps = (state) => {
    return {
        token: state.general.token
    };
};

export default Navigators;