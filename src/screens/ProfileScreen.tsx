import { Alert, Dimensions, Image, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthenicationService, StorageService } from '../services';
import { Skeleton } from '../components/skeleton';
import { clearToken, clearUserData } from '../features/general/generalSlice';
import { AppDispatch, RootState } from '../Store';
import { useDispatch, useSelector } from 'react-redux';
import { Display } from '../utils';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { ThemeType, theme } from '../theme/theme';
import MN from '../assets/MN_LOGO_LG_NBG.png';
import { dropAllTables } from '../db/DropData';

const { width, height } = Dimensions.get('window');

interface Styles {
    shadow: ViewStyle;
    AppBar: ViewStyle;
}

type RootStackParamList = {
    Profile: undefined;
    MealType: undefined;
    Cart: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileScreenProps {
    navigation: ProfileScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Profile'>;
}

const skeleton = () => {
    return (
        <>
            <View
                style={{
                    width,
                    height,
                    backgroundColor: theme.colors.background.bgGrayPurple,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'column'
                }}
            >
                <View
                    style={{
                        width,
                        height: Display.setHeight(12),
                        backgroundColor: theme.colors.primary.dark,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 35,
                            color: theme.colors.accent.light,
                        }}
                    >Persönliche Angaben</Text>
                </View>
                <View>
                    <Skeleton height={Display.setHeight(12)} width={Display.setWidth(90)} style={{ borderRadius: 12, alignSelf: 'center', marginTop: Display.setHeight(1.5) }} />
                    <View
                        style={{
                            width: Display.setHeight(5),
                            height: Display.setHeight(5),
                            borderRadius: 2,
                            flexDirection: 'row',
                            position: 'absolute',
                            left: '10%',
                            top: '15%',
                        }}
                    >
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(18)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                            <Skeleton height={Display.setHeight(2)} width={Display.setHeight(27)} style={{ borderRadius: 5, marginTop: Display.setHeight(3) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                        </View>
                    </View>
                </View>
                <View>
                    <Skeleton height={Display.setHeight(12)} width={Display.setWidth(90)} style={{ borderRadius: 12, alignSelf: 'center', marginTop: Display.setHeight(1.5) }} />
                    <View
                        style={{
                            width: Display.setHeight(5),
                            height: Display.setHeight(5),
                            borderRadius: 2,
                            flexDirection: 'row',
                            position: 'absolute',
                            left: '10%',
                            top: '15%',
                        }}
                    >
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(18)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                            <Skeleton height={Display.setHeight(2)} width={Display.setHeight(27)} style={{ borderRadius: 5, marginTop: Display.setHeight(3) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                        </View>
                    </View>
                </View>
                <View>
                    <Skeleton height={Display.setHeight(12)} width={Display.setWidth(90)} style={{ borderRadius: 12, alignSelf: 'center', marginTop: Display.setHeight(1.5) }} />
                    <View
                        style={{
                            width: Display.setHeight(5),
                            height: Display.setHeight(5),
                            borderRadius: 2,
                            flexDirection: 'row',
                            position: 'absolute',
                            left: '10%',
                            top: '15%',
                        }}
                    >
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(18)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                            <Skeleton height={Display.setHeight(2)} width={Display.setHeight(27)} style={{ borderRadius: 5, marginTop: Display.setHeight(3) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                        </View>
                    </View>
                </View>
                <View>
                    <Skeleton height={Display.setHeight(14)} width={Display.setWidth(90)} style={{ borderRadius: 12, alignSelf: 'center', marginTop: Display.setHeight(1.5) }} />
                    <View
                        style={{
                            width: Display.setHeight(5),
                            height: Display.setHeight(5),
                            borderRadius: 2,
                            flexDirection: 'row',
                            position: 'absolute',
                            left: '10%',
                            top: '15%',
                        }}
                    >
                        <View
                            style={{
                                padding: 10
                            }}
                        >
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(18)} style={{ borderRadius: 5, marginTop: Display.setHeight(0.5) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                            <Skeleton height={Display.setHeight(2)} width={Display.setHeight(27)} style={{ borderRadius: 5, marginTop: Display.setHeight(1) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                            <Skeleton height={Display.setHeight(3)} width={Display.setHeight(12)} style={{ borderRadius: 12, marginTop: Display.setHeight(1) }} backgroundColor={"rgba(256, 256, 256, 1)"} />
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {

    const styles = getStyles(theme);

    const aspectRatio = 4265 / 1200
    const Height = Display.setHeight(4)
    const Width = Height * aspectRatio

    const dispatch = useDispatch<AppDispatch>();

    const [user, setUser] = useState<{
        Id: string;
        FullName: string;
        EmailAddress: string;
        ContactNumber: string;
        UserRole: string;
        FranchiseId: string;
        exp: string;
        iss: string;
        aud: string;
    }>();
    const [isReady, setIsReady] = useState(false);

    const { token } = useSelector((state: RootState) => state.general);

    const fetchUserData = async () => {
        try {
            const userData = await StorageService.getUserData();

            if (userData) {
                // Assuming userData is a JSON string, parse it into an object
                const parsedUserData = JSON.parse(userData);

                // Now you can safely call setUser
                setUser(parsedUserData);
            }
            console.log('userData', userData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsReady(true);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleDeletion = () => {
        Alert.alert(
            'Konto löschen',
            'Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden!',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: () => deleteAccount(),
                    style: 'destructive'
                }
            ]);

        const deleteAccount = async () => {
            try {
                const response = await AuthenicationService.deleteUserAccount(token);
                if (response?.status) {
                    await StorageService.removeData('userData');
                    await StorageService.removeData('token');

                    await dispatch(clearToken());
                    await dispatch(clearUserData());

                    await dropAllTables();

                    Alert.alert(
                        'Erfolg',
                        'Ihr Konto wurde erfolgreich gelöscht.',
                        [{ text: 'OK', onPress: () => navigation.navigate('MealType') }],
                        { cancelable: false }
                    );
                } else {
                    Alert.alert(
                        'Gescheitert',
                        'Die Kontolöschung war nicht erfolgreich. Bitte versuchen Sie es später erneut.',
                        [{ text: 'OK' }],
                        { cancelable: false }
                    );
                }
            } catch (err) {
                console.error("Error in deleting account", err);
                Alert.alert(
                    'Fehler',
                    'Bei der Löschung Ihres Kontos ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.',
                    [{ text: 'OK' }],
                    { cancelable: false }
                );
            }
        }
    }

    if (!isReady) {
        return skeleton();
    }

    return (
        <View
            style={{
                width: Display.setWidth(100),
                height: Display.setHeight(100),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
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
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: Display.setWidth(90),
                        height: Display.setHeight(10),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: theme.colors.primary.dark,
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >Name</Text>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(0.8),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{user?.FullName}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(10),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: theme.colors.primary.dark,
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >E-Mail</Text>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(0.8),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{user?.EmailAddress}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(10),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: theme.colors.primary.dark,
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >Passwort</Text>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(0.8),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >********</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(16),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: theme.colors.primary.dark,
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >Handynummer</Text>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(1.4),
                                marginTop: Display.setHeight(1.5)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(2),
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{user?.ContactNumber}</Text>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                            }}
                        >
                            <View
                                style={{
                                    width: '35%',
                                    height: Display.setHeight(4),
                                    backgroundColor: '#e1e1e1',
                                    borderRadius: Display.setHeight(2),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}
                            >
                                <MaterialIcons name='done' size={20} color="#325964" />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: '#325964',
                                        margin: 5
                                    }}
                                >Verifiziert</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: Display.setHeight(7)
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: width * 0.05,
                            alignSelf: 'flex-start',
                            color: "#325962",
                        }}
                    >Konto löschen</Text>
                    <View
                        style={{
                            width: "90%",
                            height: "90%",
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => handleDeletion()}
                        >
                            <View
                                style={{
                                    width: "100%",
                                    height: Display.setHeight(6),
                                    backgroundColor: '#f1f1f1',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: 15,
                                    borderRadius: 10,
                                    shadowColor: '#325964',
                                    shadowOffset: {
                                        width: 0,
                                        height: 3,
                                    },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 2,
                                    elevation: 10,
                                    marginBottom: Display.setHeight(8)
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: "100%",
                                        marginLeft: Display.setHeight(1.5)
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.6),
                                            color: '#FF7074',
                                            fontWeight: '500'
                                        }}
                                    >Mein Konto und zugehörige Daten löschen</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen


const getStyles = (theme: ThemeType): StyleSheet.NamedStyles<Styles> => StyleSheet.create({
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
