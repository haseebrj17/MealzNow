
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, FlatList, Animated, Alert, Platform, ViewStyle } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons, EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { StorageService, UserAddressService } from '../services';
import { Display } from '../utils';
import Input from '../components/Input';
import { useDispatch, useSelector } from 'react-redux';
// import { addUserAddress } from '../actions/UserAddressAction';
import { Separator, ToggleButton, Button } from '../components';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemeType, theme } from '../theme/theme';
import { AppDispatch, RootState } from '../Store';
import EntypoIconName from '@expo/vector-icons/build/Entypo';
import IoniconsName from '@expo/vector-icons/build/Ionicons';

interface Styles {
    map: ViewStyle;
}

interface Inputs {
    StreetAddress: string | number | null,
    House?: string | number | null,
    District?: string | null,
    UnitNumber?: string,
    FloorNumber?: string,
    Notes?: string | null,
    Tag?: string | null,
    IsDefault?: boolean | null,
    Latitude: number,
    Longitude: number,
    CityName: string,
    PostalCode?: number | string | null,
    CountryName: string,
    StateName?: string | null,
}

interface Location {
    latitude: number | null,
    longitude: number | null,
    latitudeDelta: number | null,
    longitudeDelta: number | null,
}

interface Label {
    name: string,
    iconName: keyof typeof IoniconsName.glyphMap,
    tag: string
}

type LabelData = Label[];

interface Region {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
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
    AddressDetail: {
        address: Location.LocationGeocodedAddress | null,
        selectedLocation: Location | null,
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
    Home: undefined;
    Cart: {
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
};

type AddressDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddressDetail'>;

interface AddressDetailScreenProps {
    navigation: AddressDetailScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'AddressDetail'>;
}

const { width, height } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0024;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const labelData: LabelData = [
    {
        name: 'Heim',
        iconName: 'home-outline',
        tag: 'Heim'
    },
    {
        name: 'Arbeit',
        iconName: 'briefcase-outline',
        tag: 'Arbeit'
    },
    {
        name: 'Freund',
        iconName: 'person-outline',
        tag: 'Freund'
    },
    {
        name: "Andere",
        iconName: "add",
        tag: ''
    },
]

const CustomCallout = () => {
    return <TouchableOpacity
        style={{
            backgroundColor: '#325964',
            width: 100,
            height: 40,
        }}
    >
        <Text
            style={{
                fontSize: 12,
                fontWeight: '600',
                color: '#f1f1f1'
            }}
        >Tippen Sie auf , um den Ort zu bearbeiten</Text>
    </TouchableOpacity>
}

const AddresseButton = ({ onpress }: { onpress: () => void }) => {
    return <Button
        title="Adresse Hinzufügen"
        width={Display.setWidth(90)}
        height={Display.setHeight(6)}
        color={theme.colors.custom[2].stromboli}
        textColor={theme.colors.custom[4].snuff}
        onPress={onpress}
    />
}

const AddressDetailScreen: React.FC<AddressDetailScreenProps> = ({ navigation, route }) => {
    const address = route.params.address;
    const selectedLocation = route.params.selectedLocation;

    const dispatch = useDispatch<AppDispatch>()

    const { token } = useSelector(
        (state: RootState) => state.general
    );

    const [userToken, setUserToken] = useState<string>();

    useEffect(() => {
        setUserToken(token);
    }, []);

    const styles = getStyles(theme);

    const processAddressAddition = async (inputs: Inputs, userToken: string) => {
        try {

            console.log(userToken);

            const response = await UserAddressService.addUserAddress(inputs, userToken);

            if (response.status) {
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
                throw new Error('Unexpected response when adding address.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Fehler', 'Beim Hinzufügen der Adresse ist ein Fehler aufgetreten.');
            navigation.navigate('Cart', {
                data: route?.params?.data,
                packages: route?.params?.packages,
                packageType: route?.params?.packageType,
                totalAmount: route?.params?.totalAmount,
                totalNumberOfMeals: route?.params?.totalNumberOfMeals,
                generatedDates: route?.params?.generatedDates,
                packageId: route?.params?.packageId
            });
        }
    };

    const [data, setData] = useState<Label[]>(labelData);
    const [otherTagInput, setOtherTagInput] = useState<string>("");
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [region, setRegion] = useState<Location | null>(null);
    const [newAddress, setNewAddress] = useState<Location.LocationGeocodedAddress | null>(null);
    const [showCallout, setShowCallout] = useState(true);
    const [inputHeight, setInputHeight] = useState(new Animated.Value(0));
    const [color, setColor] = useState("#fff");
    const [HEIGHT, setHEIGHT] = useState(height * 1.05)
    const [clickedTag, setClickedTag] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<ScrollView | null>(null);

    const setStates = () => {
        setNewAddress(address);
        setRegion({
            latitude: selectedLocation?.latitude ? selectedLocation?.latitude : 0,
            longitude: selectedLocation?.longitude ? selectedLocation?.longitude : 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        });
    }

    const [inputs, setInputs] = useState<Inputs>({
        StreetAddress: address?.street ? address?.street : '',
        House: address?.streetNumber,
        PostalCode: address?.postalCode ? address?.postalCode : 0,
        CityName: address?.city ? address?.city : '',
        District: address?.district,
        UnitNumber: '',
        FloorNumber: '',
        StateName: address?.region,
        CountryName: address?.country ? address?.country : '',
        Notes: '',
        IsDefault: false,
        Tag: '',
        Latitude: selectedLocation?.latitude ? selectedLocation?.latitude : 0,
        Longitude: selectedLocation?.longitude ? selectedLocation?.longitude : 0,
    });

    const onToggleChange = (newState: boolean) => {
        setInputs(prevState => ({ ...prevState, IsDefault: newState }));
    };

    const handleOnchange = (text: any, input: any) => {
        if (input === 'Tag') {
            setOtherTagInput(text);
            if (text !== 'Heim' && text !== 'Arbeit' && text !== 'Freund') {
                setInputs(prevState => ({ ...prevState, [input]: text }));
            }
            return text
        } else {
            setInputs(prevState => ({ ...prevState, [input]: text }));
            console.log(inputs)
        }
    };

    const handleTagChange = (tag: any, name: any) => {
        if (tag === clickedTag) {
            if (tag === clickedTag && name === 'Andere') {
                Animated.timing(inputHeight, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
                setClickedTag(null);
                setInputs(prevState => ({ ...prevState, 'tag': '' }));
            } else {
                setClickedTag(null);
                setInputs(prevState => ({ ...prevState, 'tag': '' }));
            }
        } else {
            setClickedTag(tag);
            setInputs(prevState => ({ ...prevState, 'Tag': tag }));

            if (name === 'Andere') {
                Animated.timing(inputHeight, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
                setHEIGHT(height * 1.15);
                setTimeout(() => {
                    scrollRef?.current?.scrollToEnd({ animated: true });
                }, 100);
            } else {
                Animated.timing(inputHeight, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }).start();
            }
        }
    };

    useEffect(() => {
        setStates();
    }, [])

    const mapRef = useRef<MapView>(null);

    const renderItem = ({ item }: { item: Label }) => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        handleTagChange(item.tag, item.name)
                    }}
                >
                    <View
                        style={{
                            width: Display.setHeight(8),
                            height: Display.setHeight(8),
                            borderRadius: Display.setHeight(4),
                            backgroundColor: item.tag === clickedTag ? theme.colors.custom[2].stromboli : color,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.4,
                            shadowRadius: 5,
                            elevation: 10,
                            margin: Display.setHeight(1)
                        }}
                    >
                        <Ionicons name={item.iconName} size={28} color={item.tag === clickedTag ? theme.colors.custom[3].anzac : theme.colors.custom[2].stromboli} />
                    </View>
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: theme.colors.custom[2].stromboli
                    }}
                >{item.name}</Text>
            </View>
        )
    }

    return (
        <View
            style={{
                height,
                width,
                alignItems: 'center',
                backgroundColor: '#fff'
            }}
        >
            <View
                style={{
                    width,
                    height: height * 0.43,
                    position: 'absolute',
                    top: '0%',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    mapType={'mutedStandard'}
                    ref={mapRef}
                    showsUserLocation
                    initialRegion={region as Region}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    onPress={() => setShowCallout(false)}
                >
                </MapView>
                <View
                    style={{
                        left: '44.6%',
                        position: 'absolute',
                        top: Display.setHeight(43) * 0.50,
                    }}
                >
                    <TouchableOpacity onPress={() => setShowCallout(true)}>
                        <MaterialIcons name="location-pin" size={Display.setHeight(5)} color={theme.colors.custom[2].stromboli} />
                    </TouchableOpacity>
                    {showCallout &&
                        <View
                            style={{
                                position: 'absolute',
                                bottom: Display.setHeight(6.5),
                                right: Display.setHeight(-4),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                width: Display.setHeight(13),
                                height: Display.setHeight(4.5),
                                backgroundColor: theme.colors.custom[2].stromboli,
                                borderRadius: 12,
                                padding: Display.setWidth(1)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    } else {
                                        navigation.navigate('Home');
                                    }
                                }}
                            >
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        left: '-5%',
                                        top: '90%',
                                        fontSize: Display.setHeight(0.8),
                                        fontWeight: '600',
                                        color: theme.colors.custom[4].snuff,
                                    }}
                                >Zum Bearbeiten tippen</Text>
                                <SimpleLineIcons
                                    name="arrow-right"
                                    size={Display.setHeight(1.5)}
                                    color={theme.colors.custom[4].snuff}
                                    style={{
                                        position: "absolute",
                                        top: "60%",
                                        right: "-10%",
                                    }}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    top: '40%',
                                    width: 0,
                                    height: 0,
                                    backgroundColor: 'transparent',
                                    borderStyle: 'solid',
                                    borderLeftWidth: 10,
                                    borderRightWidth: 10,
                                    borderBottomWidth: 20,
                                    borderLeftColor: 'transparent',
                                    borderRightColor: 'transparent',
                                    borderBottomColor: theme.colors.custom[2].stromboli,
                                    transform: [
                                        { rotate: '180deg' }
                                    ]
                                }}
                            />
                        </View>
                    }
                </View>
            </View>
            <ScrollView
                ref={scrollRef}
                style={{
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    position: 'absolute',
                    backgroundColor: '#fff',
                    width,
                    height: height * 0.5,
                    top: height * 0.39,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        height: HEIGHT,
                        marginBottom: Display.setHeight(10)
                    }}
                >
                    <View
                        style={{
                            width: width * 0.9,
                            height: Display.setHeight(8),
                            borderRadius: 10,
                            backgroundColor: theme.colors.accent.mediumGray,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            padding: "3%",
                            marginTop: Display.setHeight(3)
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <MaterialIcons name="info" size={Display.setHeight(2)} color={theme.colors.accent.disabledGray} />
                        </View>
                        <View
                            style={{
                                width: '90%',
                                marginLeft: Display.setHeight(0.6)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.4),
                                    fontWeight: '400'
                                }}
                            >Ihr Fahrer liefert an die angegebene Adresse. Sie können Ihre schriftliche Adresse für mehr Genauigkeit bearbeiten.</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            width: width * 0.9,
                            marginTop: Display.setHeight(2)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: theme.colors.custom[2].stromboli,
                            }}
                        >Eine neue Adresse hinzufügen</Text>
                    </View>
                    <View
                        style={{
                            width: width * 0.9,
                            height: Display.setHeight(6),
                            justifyContent: 'center',
                            flexDirection: 'row',
                            marginVertical: Display.setHeight(2)
                        }}
                    >
                        <View
                            style={{
                                width: '15%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <EvilIcons name="location" size={Display.setHeight(4)} color={theme.colors.custom[2].stromboli} />
                        </View>
                        <View
                            style={{
                                width: '85%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        marginVertical: Display.setHeight(0.5)
                                    }}
                                >{address?.name ? address.name : ''}</Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: theme.colors.accent.textGray,
                                    }}
                                >{address?.city ? address.city : ''}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.canGoBack()) {
                                        navigation.goBack();
                                    } else {
                                        navigation.navigate('Home');
                                    }
                                }}
                            >
                                <Feather name="edit-2" size={22} color={theme.colors.custom[2].stromboli} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            width: "90%",
                            alignSelf: 'center',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View
                                style={{
                                    height: height * 0.06,
                                    width: '48%',
                                    backgroundColor: theme.colors.accent.lightGray,
                                    flexDirection: 'row',
                                    paddingHorizontal: 15,
                                    borderWidth: 0.5,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.6),
                                        fontWeight: '600',
                                    }}
                                >{address?.streetNumber}</Text>
                            </View>
                            <View
                                style={{
                                    height: height * 0.06,
                                    width: '48%',
                                    backgroundColor: theme.colors.accent.lightGray,
                                    flexDirection: 'row',
                                    paddingHorizontal: 15,
                                    borderWidth: 0.5,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.6),
                                        fontWeight: '600',
                                    }}
                                >{address?.street}</Text>
                            </View>
                        </View>
                        <Input
                            onChangeText={text => handleOnchange(text, 'UnitNumber')}
                            placeholder="Appartmentnummer"
                            keyboardType="default"
                            label='Appartmentnummer'
                            iconName='home'
                            password={false}
                        />
                        <Input
                            placeholder="Stockwerk Nummer"
                            iconName='home-floor-g'
                            password={false}
                            label='Stockwerk Nummer'
                            keyboardType="default"
                            onChangeText={text => handleOnchange(text, 'FloorNumber')}
                        />
                    </View>
                    <View
                        style={{
                            width: '90%',
                            marginTop: Display.setHeight(2)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: theme.colors.custom[2].stromboli,
                                marginTop: Display.setHeight(2)
                            }}
                        >Standard einstellen</Text>
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 25,
                                fontWeight: '300'
                            }}
                        >Diese Adresse als Standardadresse hinzufügen?</Text>
                        <View
                            style={{
                                width,
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginTop: Display.setHeight(2)
                            }}
                        >
                            <ToggleButton size={1} onToggle={onToggleChange} />
                        </View>
                    </View>
                    <View
                        style={{
                            width: '90%',
                            marginTop: Display.setHeight(2)
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: theme.colors.custom[2].stromboli,
                                marginTop: Display.setHeight(2)
                            }}
                        >Anweisungen für die Lieferung</Text>
                        <Text
                            style={{
                                fontSize: 13,
                                lineHeight: 25,
                                fontWeight: '300'
                            }}
                        >Geben Sie uns mehr Informationen über Ihre Adresse.</Text>
                        <Input
                            onChangeText={text => handleOnchange(text, 'Notes')}
                            keyboardType="default"
                            label='Note'
                            iconName='note-edit'
                            password={false}
                        />
                    </View>
                    <View
                        style={{
                            width: '90%',
                            marginTop: Display.setHeight(2),
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: theme.colors.custom[2].stromboli,
                                marginTop: Display.setHeight(2)
                            }}
                        >Ein Etikett hinzufügen</Text>
                        <FlatList
                            horizontal
                            data={data}
                            keyExtractor={(item, index) => item + '-' + index}
                            renderItem={renderItem}
                        />
                        <Animated.View style={{ height: inputHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }), overflow: 'hidden' }}>
                            <Input
                                onChangeText={(text) => handleOnchange(text, 'Tag')}
                                placeholder="Enter custom label..."
                            />
                        </Animated.View>
                    </View>
                </View>
            </ScrollView>
            <View
                style={{
                    height: Display.setHeight(11),
                    width,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingVertical: theme.padding.small,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? '0%' : '5%'
                }}
            >
                <Separator
                    width={Display.setWidth(100)}
                    height={Display.setHeight(0.1)}
                />
                <AddresseButton
                    onpress={() => {
                        processAddressAddition(inputs, userToken ? userToken : '')
                    }}
                />
            </View>
        </View>
    )
}

const getStyles = (theme: ThemeType): StyleSheet.NamedStyles<Styles> => StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})

export default AddressDetailScreen