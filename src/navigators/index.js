import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
    AllergiesScreen,
    HomeScreen,
    MealTypeScreen
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