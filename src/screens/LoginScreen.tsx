import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, Image, Keyboard, Alert, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { TextInput } from 'react-native-paper'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FormControl, Stack, WarningOutlineIcon, Box, Center, NativeBaseProvider, Icon } from "native-base";
import { theme } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthRequest } from 'expo-auth-session';
import * as AuthSession from 'expo-auth-session';
import { Input, Loader } from '../components';
import Button from '../components/Button';
import { StorageService } from '../services';
import { Dispatch } from 'react';
import AuthenticationService from '../services/AuthenticationService';
import { Display } from '../utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Entypo } from '@expo/vector-icons';
import EntypoIconName from '@expo/vector-icons/build/Entypo';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Store';
import { setToken, setUserData } from '../features/general/generalSlice';
import jwt_Decode from "jwt-decode";
import AnimatedLottieView from 'lottie-react-native';
import LoadingOverlay from '../components/LoadingOverlay';


const { width, height } = Dimensions.get('screen')

interface FormInputs {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string | null;
    password?: string | null;
}

interface CodeData {
    code: string;
    id: string;
}

interface CodeError {
    code: string | null;
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

type RootStackParamList = {
    Login: {
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
    Cart: {
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
    Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Login'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {

    const dispatch = useDispatch<AppDispatch>();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState({});
    const [deviceToken, setDeivceToken] = useState<string | null>(null)
    const [inputs, setInputs] = useState<FormInputs>({ email: '', password: '' });
    const [subLoading, setSubLoading] = useState<boolean>(false);

    const validate = async () => {
        Keyboard.dismiss();
        let isValid = true;
        if (!inputs.email) {
            handleError('Bitte E-Mail eingeben', 'email');
            isValid = false;
        }
        if (!inputs.password) {
            handleError('Bitte Passwort eingeben', 'password');
            isValid = false;
        }
        if (isValid) {
            Login(inputs);
        }
    };

    // async function registerForPushNotificationsAsync() {

    //     if (Platform.OS === 'android') {
    //         Notifications.setNotificationChannelAsync('default', {
    //             name: 'default',
    //             importance: Notifications.AndroidImportance.MAX,
    //             vibrationPattern: [0, 250, 250, 250],
    //             lightColor: '#FF231F7C',
    //         });
    //     }

    //     if (Device.isDevice) {
    //         const { status: existingStatus } = await Notifications.getPermissionsAsync();
    //         let finalStatus = existingStatus;
    //         if (existingStatus !== 'granted') {
    //             const { status } = await Notifications.requestPermissionsAsync();
    //             finalStatus = status;
    //         }
    //         if (finalStatus !== 'granted') {
    //             alert('Failed to get push token for push notification!');
    //             return;
    //         }
    //         const token = await Notifications.getExpoPushTokenAsync({
    //             projectId: Constants?.expoConfig?.extra?.eas.projectId,
    //         });
    //         setDeivceToken(token?.data.toString());
    //         console.log(token);
    //     } else {
    //         alert('Must use physical device for Push Notifications');
    //     }

    //     if (deviceToken !== undefined && deviceToken !== null && deviceToken !== '') {
    //         console.log(deviceToken);
    //         setInputs(prevState => ({
    //             ...prevState,
    //             customerDevice: [
    //                 ...prevState.customerDevice,
    //                 { deviceId: deviceToken, isActive: true }
    //             ]
    //         }));
    //         await StorageService.setDeviceToken(deviceToken);
    //         console.log(inputs);
    //     } else {
    //         console.error('Token is undefined');
    //     }

    //     return deviceToken ? deviceToken : null;
    // // }

    // useEffect(() => {
    //     registerForPushNotificationsAsync();

    //     const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
    //         console.log(notification);
    //     });

    //     const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    //         console.log(response);
    //     });

    //     return () => {
    //         Notifications.removeNotificationSubscription(notificationSubscription);
    //         Notifications.removeNotificationSubscription(responseSubscription);
    //     };
    // }, []);

    const Login = async (inputs: FormInputs) => {
        setIsLoading(true);
        setSubLoading(true);
        let user = {
            EmailAddress: inputs.email,
            Password: inputs.password,
        };
        try {
            console.log("User:", user);
            const response = await AuthenticationService.login(user);
            setIsLoading(false);
            console.log("Response status:", response.data);
            if (response?.status) {
                await StorageService.setToken(response?.data?.Token);
                dispatch(setToken(response?.data?.Token));

                const decodedData = jwt_Decode(response?.data?.Token);
                await StorageService.setUserData(decodedData);
                dispatch(setUserData(decodedData));
                navigation.navigate('Cart', {
                    data: route?.params?.data,
                    packages: route?.params?.packages,
                    packageType: route?.params?.packageType,
                    totalAmount: route?.params?.totalAmount,
                    totalNumberOfMeals: route?.params?.totalNumberOfMeals,
                    generatedDates: route?.params?.generatedDates,
                    packageId: route?.params?.packageId
                });
            } else {
                Alert.alert('Error', response?.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            setSubLoading(false);
        }
    };

    const handleOnchange = (text: string, input: string) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    const handleError = (error: string | null, input: keyof FormErrors) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const [loading, setLoading] = React.useState(false);

    if (subLoading) {
        return <LoadingOverlay />
    }

    return (
        <BottomSheetModalProvider>
            <View
                style={{
                    width: Display.setWidth(100),
                    height: Display.setHeight(100),
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: Display.setWidth(100),
                        height: Display.setHeight(100 - 50),
                        position: 'absolute',
                        top: 0,
                    }}
                >
                    <Image
                        source={require('../assets/images/Register.png')}
                        style={{
                            width: Display.setWidth(100),
                            height: 'auto',
                            aspectRatio: 500 / 666,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
                        style={{
                            flex: 1
                        }}>
                        <View
                            style={{
                                width: Display.setWidth(100),
                                height: Display.setHeight(60),
                                backgroundColor: theme.colors.white,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                position: 'absolute',
                                bottom: 0,
                                borderTopLeftRadius: Display.setHeight(5),
                                borderTopRightRadius: Display.setHeight(5),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(4),
                                    fontWeight: 'bold',
                                    color: theme.colors.custom[2].stromboli,
                                    margin: Display.setHeight(2),
                                }}
                            >Anmelden</Text>
                            <View
                                style={{
                                    width: Display.setWidth(80),
                                    height: width,
                                    alignSelf: 'center',
                                }}
                            >
                                <Input
                                    onChangeText={(text: string) => handleOnchange(text, 'email')}
                                    onFocus={() => handleError(null, 'email')}
                                    iconName="email-outline"
                                    label="E-Mail"
                                    placeholder="Geben Sie Ihre E-Mail Adresse ein"
                                    error={errors.email}
                                />
                                <Input
                                    onChangeText={(text: string) => handleOnchange(text, 'password')}
                                    onFocus={() => handleError(null, 'password')}
                                    iconName="lock-outline"
                                    label="Passwort"
                                    placeholder="Geben Sie Ihr Passwort ein"
                                    error={errors.password}
                                    password
                                />
                                <Button title="Anmelden" onPress={validate}
                                    color={theme.colors.custom[2].stromboli}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
                <View
                    style={{
                        width: Display.setWidth(100),
                        marginBottom: Display.setHeight(2),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 0,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: Display.setHeight(2),
                            color: theme.colors.primary.dark
                        }}
                    >Sie haben noch kein Konto? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                    ><Text
                        style={{
                            fontWeight: "500",
                            fontSize: Display.setHeight(2),
                            color: theme.colors.custom[2].stromboli
                        }}
                    >Registrieren</Text></TouchableOpacity>
                </View>
            </View>
        </BottomSheetModalProvider>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
    },
    text: {
        fontSize: 30,
        color: '#fff',
    },
    overlay: {
        backgroundColor: '#fff',
        opacity: 0.3,
    },
});