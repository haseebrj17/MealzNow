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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Store';
import { setToken, setUserData } from '../features/general/generalSlice';
import jwt_Decode from "jwt-decode";
import AnimatedLottieView from 'lottie-react-native';
import { updateCustomerInfo, updateFranchiseInfo } from '../features/cart/cartSlice';
import { UserData } from '../types/general';

const { width, height } = Dimensions.get('screen')

interface FormInputs {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    customerDevice: Devices[] | [];
}

interface Devices {
    deviceId: string;
    isActive: boolean;
}

interface FormErrors {
    email?: string | null;
    fullname?: string | null;
    phone?: string | null;
    password?: string | null;
}

interface CodeData {
    code: string;
    id: string;
}

interface CodeError {
    code: string | null;
}


type RootStackParamList = {
    Register: undefined;
    AddressAccess: undefined;
    Login: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Register'>;
}

interface AnimationData {
    reqCode: string;
    codeDone: string;
    color: string;
    name: keyof typeof EntypoIconName.glyphMap;
    verified: boolean;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation, route }) => {

    const dispatch = useDispatch<AppDispatch>();

    const { franchiseDetails } = useSelector(
        (state: RootState) => state.franchise
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorMessage, setErrorMessage] = useState({});
    const [deviceToken, setDeivceToken] = useState<string | null>(null)
    const [animationData, setAnimationData] = useState<AnimationData>({
        reqCode: 'Geben Sie den 6-stelligen Code ein, der an Ihr Telefon gesendet wird.',
        codeDone: 'Code-Bestätigung',
        color: theme.colors.custom[2].stromboli,
        name: 'cross',
        verified: false,
    })

    async function registerForPushNotificationsAsync() {
        let token: string | null = null;

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const Localtoken = await Notifications.getExpoPushTokenAsync({
                projectId: Constants?.expoConfig?.extra?.eas.projectId,
            });
            if (Localtoken) {
                token = Localtoken?.data.toString();
            }
            console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (token) {
            setToken(token);
            setInputs(prevState => ({
                ...prevState,
                customerDevice: [
                    ...prevState.customerDevice,
                    { deviceId: token ?? '', isActive: true }
                ]
            }));
            await StorageService.setDeviceToken(token);
        } else {
            console.error('Token is undefined');
        }

        return token ? token : null;
    }

    useEffect(() => {
        registerForPushNotificationsAsync();

        const notificationSubscription = Notifications.addNotificationReceivedListener(notification => {
            console.log(notification);
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationSubscription);
            Notifications.removeNotificationSubscription(responseSubscription);
        };
    }, []);

    ///// Email Registration /////

    const [inputs, setInputs] = useState<FormInputs>({ email: '', fullname: '', phone: '', password: '', customerDevice: [] });

    let margin = 50;
    if (!inputs.email && !inputs.fullname && !inputs.password) {
        margin = 40
    }

    const [loading, setLoading] = React.useState(false);

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.email) {
            handleError('Bitte E-Mail eingeben', 'email');
            isValid = false;
            margin = 40
        } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
            handleError('Bitte geben Sie eine gültige E-Mail ein', 'email');
            isValid = false;
            margin = 40
        }

        if (!inputs.fullname) {
            handleError('Bitte Name und Vorname eingeben', 'fullname');
            isValid = false;
            margin = 40
        }

        if (!inputs.phone) {
            handleError('Bitte Handynummer eingeben', 'phone');
            isValid = false;
            margin = 40
        }

        if (!inputs.password) {
            handleError('Bitte Passwort eingeben', 'password');
            isValid = false;
            margin = 40
        } else if (inputs.password.length < 6) {
            handleError('Mindestpasswortlänge von 6', 'password');
            isValid = false;
            margin = 40
        }

        if (isValid) {
            register();
        }
    };

    const register = async () => {

        console.log(inputs)
        const user = {
            FullName: inputs.fullname,
            EmailAddress: inputs.email,
            ContactNumber: inputs.phone,
            Password: inputs.password,
            CustomerDevice: [
                { deviceId: deviceToken ?? 'ExponentPushToken[_tOMDtBWSSXjk-73I-K9pj]', isActive: true }
            ]
        };

        setIsLoading(true);

        try {
            const response = await AuthenticationService.register(user);
            if (response?.status) {
                const userId = response?.data?.data?.Id;
                if (userId) {
                    handleCodeOnchange(response?.data?.data?.Id, 'id');
                    handlePresentModal();
                }
            } else {
                setErrorMessage(response?.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmCode = async () => {
        try {
            const response = await AuthenticationService.phoneVerification(codeData);
            setIsLoading(false);

            if (response?.status) {
                console.log(response?.data);
                setAnimationData({
                    reqCode: 'Rufnummer erfolgreich überprüft',
                    codeDone: 'Geprüft',
                    color: theme.colors.custom[3].anzac,
                    name: 'check',
                    verified: true,
                });
                await StorageService.setToken(response?.data?.Token)
                dispatch(setToken(response?.data?.Token));

                const decodedData = jwt_Decode(response?.data?.Token) as UserData;
                await StorageService.setUserData(decodedData)
                dispatch(setUserData(decodedData))

                dispatch(updateCustomerInfo({ customerId: decodedData?.Id }))

                dispatch(updateFranchiseInfo({ franchiseId: franchiseDetails?.Id }))

                setTimeout(() => {
                    navigation.navigate('AddressAccess')
                }, 3000);
                Alert.alert('Erfolg', 'Ihr Konto wurde verifiziert!');
            } else {
                Alert.alert('Fehler', response?.message || 'Ungültiger Verifizierungscode.');
            }

        } catch (error) {
            console.log('Verification error:', error);
            Alert.alert('Fehler', 'Code kann nicht verifiziert werden.');
        }
    };

    const [isOpen, setIsOpen] = useState<boolean>(true)

    const [isEnabled, setIsEnabled] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
    const snapPoints = ["90%"];

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
    }

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        bottomSheetModalRef?.current?.close();
    }, []);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={1}
                opacity={0.7}
                onPress={closeBottomSheet} />
        ),
        [closeBottomSheet]
    );

    const handleSheetChanges = useCallback((index: number) => {
        setIsOpen(index > 0 ? true : false);
    }, []);

    const handleOnchange = (text: string, input: string) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    const handleError = (error: string | null, input: keyof FormErrors) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    const [CodeError, setCodeError] = useState<CodeError>();
    const [codeData, setCodeData] = useState<CodeData>({ code: '', id: '' });

    const handleCodeError = (error: string | null, input: keyof CodeError) => {
        setCodeError(prevState => ({ ...prevState, [input]: error }));
    };

    const handleCodeOnchange = (text: string, input: keyof CodeData) => {
        setCodeData(prevState => ({ ...prevState, [input]: text }));
    };

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
                        height: Display.setHeight(100 - 60),
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
                                height: Display.setHeight(75),
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
                            >Register</Text>
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
                                    onChangeText={(text: string) => handleOnchange(text, 'fullname')}
                                    onFocus={() => handleError(null, 'fullname')}
                                    iconName="account-outline"
                                    label="Voller Name"
                                    placeholder="Geben Sie Ihren vollen Namen ein"
                                    error={errors.fullname}
                                />
                                <Input
                                    keyboardType="phone-pad"
                                    onChangeText={(text: string) => handleOnchange(text, 'phone')}
                                    onFocus={() => handleError(null, 'phone')}
                                    iconName="phone-outline"
                                    label="Handy-Nummer"
                                    placeholder="Your phone number +49 851 98...."
                                    error={errors.phone}
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
                                <Button title="Registrieren" onPress={validate}
                                    color={theme.colors.custom[2].stromboli}
                                />
                            </View>
                            {
                                codeData.id &&
                                <TouchableOpacity
                                    onPress={handlePresentModal}
                                >
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.8),
                                            fontWeight: 'bold',
                                            color: theme.colors.custom[2].stromboli,
                                            margin: Display.setHeight(1),
                                        }}
                                    >Open Code panel?</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
                <View
                    style={{
                        width: Display.setWidth(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: Platform.OS === 'ios' ? Display.setHeight(3) : Display.setHeight(1),
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: Display.setHeight(2),
                            color: theme.colors.primary.dark
                        }}
                    >Sie haben bereits ein Konto? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                    ><Text
                        style={{
                            fontWeight: "500",
                            fontSize: Display.setHeight(2),
                            color: theme.colors.custom[2].stromboli
                        }}
                    >Anmelden</Text></TouchableOpacity>
                </View>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'height' : 'height'}
                style={{
                    flex: 1
                }}>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                    index={0}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                    onDismiss={() => setIsOpen(false)}
                    backgroundStyle={{
                        borderRadius: 30
                    }}
                    animateOnMount={true}
                >
                    <View
                        style={{
                            width: Display.setWidth(100),
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: Display.setHeight(2),
                        }}
                    >
                        <View
                            style={{
                                width: Display.setHeight(11),
                                height: Display.setHeight(11),
                                backgroundColor: theme.colors.custom[3].anzac,
                                borderRadius: Display.setHeight(5.5),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {
                                animationData.verified &&
                                <AnimatedLottieView
                                    source={require('../assets/Code.json')}
                                    autoPlay
                                    loop
                                    style={{
                                        width: Display.setHeight(8),
                                        height: Display.setHeight(8),
                                    }}
                                />
                            }
                            {
                                !animationData.verified &&
                                <AnimatedLottieView
                                    source={require('../assets/CodeSuccess.json')}
                                    autoPlay
                                    loop
                                    style={{
                                        width: Display.setHeight(8),
                                        height: Display.setHeight(8),
                                    }}
                                />
                            }
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#6b7280",
                                margin: 20,
                                textAlign: 'center'
                            }}
                        >{animationData.reqCode}</Text>
                        <View
                            style={{
                                width: Display.setWidth(90),
                                height: '60%',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                            }}
                        >
                            <Input
                                onFocus={() => handleCodeError(null, 'code')}
                                label="Verifizierungscode"
                                error={CodeError?.code}
                                iconName='lock-outline'
                                onChangeText={(text: string) => handleCodeOnchange(text, 'code')}
                                placeholder="Verifizierungscode"
                                keyboardType="numeric"
                            />
                            <Button
                                disabled={codeData?.code ? false : true}
                                color={codeData?.code ? theme.colors.custom[2].stromboli : theme.colors.accent.disabledGray}
                                title='Bestätigen' onPress={handleConfirmCode}
                            />
                        </View>
                    </View>
                </BottomSheetModal>
            </KeyboardAvoidingView>
        </BottomSheetModalProvider>
    )
}

export default RegisterScreen

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