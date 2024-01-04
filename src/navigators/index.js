import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
    HomeScreen,
    MealTypeScreen,
    AllergiesScreen,
    PreferredCuisineScreen,
    MealPerDayScreen,
    DeliveriesPerWeekScreen,
    MealsScreen,
    StartDateAndSlotsScreen,
} from "../screens";
import { Connect } from "react-redux";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "transparent",
    },
};

const Stack = createStackNavigator();

const Navigators = () => {
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
                <Stack.Screen name="MealPerDay" component={MealPerDayScreen} />
                <Stack.Screen name="DeliveriesPerWeek" component={DeliveriesPerWeekScreen} />
                <Stack.Screen name="StartDateAndSlots" component={StartDateAndSlotsScreen} />
                <Stack.Screen name="Meals" component={MealsScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const mapStateToProps = state => {
    return {
        token: state.generalState.token
    };
};

export default Navigators;