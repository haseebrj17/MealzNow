import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Dimensions, StyleSheet, Image, Animated, Text, TouchableOpacity, Platform } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper'
import MapView, { MapType, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import CustomLocationPin from '../assets/icons/CustomLocationPin';
import { MaterialIcons, Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Display } from '../utils';
import { GOOGLE_LOCATION_AUTO_COMPLETE_IOS, GOOGLE_LOCATION_AUTO_COMPLETE_ANDROID } from '@env'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { NativeBaseProvider } from 'native-base';
import { Input } from '@rneui/base';
import { Button } from '../components';
import { StorageService } from '../services';
import { useDispatch } from 'react-redux';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { theme } from '../theme/theme';

interface AddressProps {
    // address: Address;
    selectedLocation: {
        latitude: number;
        longitude: number;
    }
}

interface Location {
    latitude: number | null,
    longitude: number | null,
    latitudeDelta: number | null,
    longitudeDelta: number | null,
}

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
    AddressAccess: {
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
    AddressDetail: {
        address: Location.LocationGeocodedAddress | null,
        selectedLocation: Location | null
        data: MealPlan[],
        packages: CustomerPackage,
        packageType: Package,
        totalAmount: number,
        totalNumberOfMeals: number,
        generatedDates: DayWithDateAndSlots[] | null,
        packageId: string
    };
};

type AddressAccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddressAccess'>;

interface AddressAccessScreenProps {
    navigation: AddressAccessScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'AddressAccess'>;
}

const { width, height } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0024;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AddressAccessScreen: React.FC<AddressAccessScreenProps> = ({ navigation, route }) => {

    const [isOpen, setIsOpen] = useState(true)

    const [isEnabled, setIsEnabled] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModalMethods>(null);
    const snapPoints = ["50%", "70%"];

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

    const [region, setRegion] = useState<Region | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>('');
    const [selectedLocation, setSelectedLocation] = useState<Location | null>({
        latitude: null,
        longitude: null,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    const [address, setAddress] = useState<Location.LocationGeocodedAddress | null>(null);
    const [addressName, setAddressName] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null)
    const [disabled, setDisabled] = useState(true);
    const [addressAdded, setAddressAdded] = useState(false)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            Address(location.coords);
            setSelectedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            })
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            });
        })();
    }, []);

    const Address = async (location: { latitude: number, longitude: number }) => {
        const { latitude, longitude } = location;
        let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude
        });
        if (response[0]) {
            let firstAddress = response[0];
            let formattedAddressName = `${firstAddress.name}`;
            let formattedAddressCity = `${firstAddress.city}`;
            setAddress(firstAddress)
            setAddressName(formattedAddressName);
            setCity(formattedAddressCity)
        }
    }

    const markerTop = useRef(new Animated.Value(0)).current;
    const animatedValue = useRef(new Animated.Value(0)).current;

    const mapRef = useRef<MapView>(null);

    const [mapType, setMapType] = useState<MapType>('mutedStandard');

    const toggleMapType = () => {
        setMapType(mapType === 'mutedStandard' ? 'satellite' : 'mutedStandard');
    };

    const [miniMapType, setMiniMapType] = useState<MapType>('satellite');

    const toggleMiniMapType = () => {
        setMiniMapType(miniMapType === 'satellite' ? 'mutedStandard' : 'satellite');
        toggleMapType()
    };

    const animateToUserLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});
        mapRef?.current?.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }, 500);
    };

    const onRegionChange = (selectedLocation: Location) => {
        Animated.parallel([
            Animated.timing(animatedValue, {
                toValue: 0.5,
                duration: 10,
                useNativeDriver: true,
            }),
            Animated.timing(markerTop, {
                toValue: -5,
                duration: 10,
                useNativeDriver: true,
            })
        ]).start();
        setSelectedLocation(selectedLocation);
    };

    const onRegionChangeComplete = (selectedLocation: Location) => {
        Animated.parallel([
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(markerTop, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            })
        ]).start();
        if ((selectedLocation?.latitude?.toFixed(6) !== region?.latitude?.toFixed(6)) || (selectedLocation?.longitude?.toFixed(6) !== region?.longitude?.toFixed(6))) {
            setSelectedLocation(selectedLocation);
            Address(selectedLocation as { latitude: number, longitude: number });
            setAddressAdded(true);
            setDisabled(false);
        } else {
            setSelectedLocation(region);
            setDisabled(true);
        }
    };

    const pinStyle = {
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3]
                })
            },
            { translateY: markerTop }
        ],
        opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.6]
        }),
    };

    const AddressButton = () => {
        return <Button
            disabled={disabled}
            title="Adressdetails hinzufügen"
            color={theme.colors.custom[2].stromboli}
            width={Display.setWidth(90)}
            height={Display.setHeight(5)}
            textColor={theme.colors.custom[4].snuff}
            onPress={() => navigation.navigate('AddressDetail', {
                address,
                selectedLocation,
                data: route?.params?.data,
                packages: route?.params?.packages,
                packageType: route?.params?.packageType,
                totalAmount: route?.params?.totalAmount,
                totalNumberOfMeals: route?.params?.totalNumberOfMeals,
                generatedDates: route?.params?.generatedDates,
                packageId: route?.params?.packageId
            })}
        />
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    width,
                    height: height * 0.70,
                    position: 'absolute',
                    top: '0%'
                }}
            >
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    mapType={mapType}
                    ref={mapRef}
                    showsUserLocation
                    initialRegion={region ?? undefined}
                    onRegionChange={onRegionChange}
                    onRegionChangeComplete={onRegionChangeComplete}
                >
                </MapView>
                <Animated.View style={[styles.markerFixed, { transform: [{ translateY: markerTop }] }]}>
                    <Animated.View style={[styles.markerFixed, pinStyle]}>
                        <MaterialIcons name="location-pin" size={Display.setHeight(5)} color="#FFAF51" />
                    </Animated.View>
                </Animated.View>
            </View>
            {errorMsg && <Text>{errorMsg}</Text>}
            <View
                style={{
                    position: 'absolute',
                    bottom: '0%',
                    width,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <View
                    style={{
                        zIndex: 9999,
                        width: Display.setWidth(100),
                        height: Display.setHeight(8),
                        marginBottom: Display.setHeight(1.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            width: Display.setWidth(90),
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            onPress={toggleMiniMapType}
                            style={styles.miniMap}
                        >
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={styles.miniMap}
                                mapType={miniMapType}
                                showsUserLocation
                                initialRegion={region ?? undefined}
                                onRegionChange={onRegionChange}
                                onRegionChangeComplete={onRegionChangeComplete}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={animateToUserLocation}
                            style={{
                                width: Display.setHeight(6),
                                height: Display.setHeight(6),
                                borderRadius: Display.setHeight(3),
                                backgroundColor: '#fff',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: theme.colors.custom[2].stromboli,
                                shadowOffset: {
                                    width: -1,
                                    height: 4
                                },
                                elevation: 5,
                                shadowOpacity: 0.4,
                            }}
                        >
                            <View>
                                <MaterialIcons name="my-location" size={Display.setHeight(4)} color={theme.colors.custom[2].stromboli} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        width,
                        height: height * 0.35,
                        alignItems: 'center',
                        borderTopLeftRadius: Display.setHeight(4),
                        borderTopRightRadius: Display.setHeight(4.5),
                        backgroundColor: "#fff",
                        shadowColor: theme.colors.custom[2].stromboli,
                        shadowOffset: {
                            width: 0,
                            height: -3
                        },
                        elevation: 10,
                        shadowOpacity: 0.4,
                    }}
                >
                    {!addressAdded || disabled ? (
                        <>
                            <View
                                style={{
                                    width: Display.setWidth(90),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(2.5),
                                        fontWeight: 'bold',
                                        color: theme.colors.custom[2].stromboli,
                                        marginTop: Display.setHeight(2.5)
                                    }}
                                >Eine neue Adresse hinzufügen</Text>
                            </View>
                            <TouchableOpacity onPress={handlePresentModal} style={{
                                width: Display.setHeight(90),
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View
                                    style={styles.SearchBar}
                                >
                                    <View style={styles.SearchBarContainer}>
                                        <Ionicons name="search-sharp" size={Display.setHeight(2.9)} color={theme.colors.custom[2].stromboli} />
                                        <Text style={styles.SearchBarInput}>
                                            Geben Sie Ihre Adresse ein
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <Divider
                                style={{
                                    height: Display.setHeight(0.1),
                                    backgroundColor: theme.colors.accent.lightGray,
                                    width: width,
                                    marginTop: Display.setHeight(2)
                                }}
                            />
                            <AddressButton />
                        </>
                    ) : (
                        <>
                            <View
                                style={{
                                    width: Display.setWidth(90),
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
                                                color: theme.colors.primary.dark,
                                                marginVertical: Display.setHeight(0.5)
                                            }}
                                        >{addressName ? addressName : ''}</Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: theme.colors.accent.textGray
                                            }}
                                        >{city ? city : ''}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={handlePresentModal}
                                    >
                                        <Feather name="edit-2" size={22} color={theme.colors.custom[2].stromboli} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: width * 0.9,
                                    height: Display.setHeight(8),
                                    borderRadius: 10,
                                    marginBottom: Display.setHeight(1),
                                    backgroundColor: theme.colors.accent.lightGray,
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    flexDirection: 'row',
                                    padding: "3%"
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <MaterialIcons name="info" size={Display.setHeight(2.2)} color={theme.colors.accent.borderGray} />
                                </View>
                                <View
                                    style={{
                                        width: '90%',
                                        marginLeft: Display.setHeight(0.6),
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.4),
                                            fontWeight: '400'
                                        }}
                                    >Ihr Fahrer liefert an die angegebene Adresse. Sie können Ihre schriftliche Adresse auf der nächsten Seite bearbeiten.</Text>
                                </View>
                            </View>
                            <AddressButton />
                        </>
                    )}
                </View>
            </View>
            <BottomSheetModalProvider>
                <NativeBaseProvider>
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        snapPoints={snapPoints}
                        backdropComponent={renderBackdrop}
                        onAnimate={handleSheetChanges}
                        index={0}
                        enablePanDownToClose={true}
                        onDismiss={() => setIsOpen(false)}
                        backgroundStyle={{
                            borderRadius: Display.setHeight(4)
                        }}
                        animateOnMount={true}
                    >
                        <View style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center'
                        }}>
                            <GooglePlacesAutocomplete
                                placeholder="Enter your address"
                                fetchDetails={true}
                                enableHighAccuracyLocation={true}
                                enablePoweredByContainer={false}
                                textInputProps={{
                                    InputComp: Input,
                                    leftIcon: { type: 'font-awesome', name: 'search', size: Display.setHeight(3), color: theme.colors.custom[2].stromboli },
                                    errorStyle: { color: 'red' },
                                }}
                                GooglePlacesSearchQuery={{
                                    rankby: "distance"
                                }}
                                onPress={(data, details = null) => {
                                    const selectedLoc = {
                                        latitude: details?.geometry.location.lat,
                                        longitude: details?.geometry.location.lng,
                                    };
                                    setSelectedLocation(selectedLoc as Location);
                                    Address(selectedLoc as { latitude: number, longitude: number });
                                    setAddress(details as Location.LocationGeocodedAddress | null);
                                    setAddressAdded(true);
                                    mapRef?.current?.animateToRegion({
                                        latitude: selectedLoc.latitude as number,
                                        longitude: selectedLoc.longitude as number,
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA,
                                    }, 500);
                                    bottomSheetModalRef?.current?.close();
                                }}
                                query={{
                                    key: Platform.OS === 'ios' ? GOOGLE_LOCATION_AUTO_COMPLETE_IOS : GOOGLE_LOCATION_AUTO_COMPLETE_ANDROID,
                                    language: "de",
                                    GooglePlacesSearchQuery: { rankby: 'distance' },
                                    location: `${selectedLocation?.latitude}, ${selectedLocation?.longitude}`
                                }}
                                styles={{
                                    container: {
                                        flex: 0,
                                        position: "relative",
                                        width: width * 0.9,
                                        zIndex: 1,
                                        margin: 10
                                    },
                                    listView: {
                                        width: width * 0.9,
                                    },
                                    loader: {
                                        color: '#325964'
                                    },
                                    separator: {
                                        width: width * 0.90,
                                        alignSelf: 'center',
                                        backgroundColor: '#325964'
                                    },
                                    description: {
                                        fontSize: 15,
                                        fontWeight: '400',
                                    }
                                }}
                            />
                        </View>
                    </BottomSheetModal>
                </NativeBaseProvider>
            </BottomSheetModalProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerFixed: {
        left: '50%',
        position: 'absolute',
        top: '50%',
        marginLeft: -Display.setHeight(2.5) / 2,
        marginTop: -Display.setHeight(2) / 2,
    },
    miniMap: {
        width: Display.setHeight(9),
        height: Display.setHeight(9),
        borderRadius: Display.setHeight(1),
    },
    SearchBarContainer: {
        width: '95%',
        height: "80%",
        flexDirection: 'row',
        alignItems: 'center',
    },
    SearchBar: {
        width: Display.setWidth(90),
        height: Display.setHeight(5),
        backgroundColor: 'white',
        borderRadius: Display.setHeight(1.2),
        fontSize: Display.setHeight(2.5),
        borderColor: 'rgba(50, 89, 98, 0.4)',
        borderWidth: Display.setHeight(0.1),
        marginTop: Display.setHeight(3),
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 3 },
        justifyContent: 'center',
        alignItems: 'center',
    },
    SearchBarInput: {
        fontSize: Display.setHeight(2),
        alignSelf: "center",
        opacity: 0.6,
        marginLeft: Display.setWidth(1),
    },
    ButtonSignUp: {
        width: Display.setWidth(90),
        height: Display.setHeight(5),
        borderWidth: Display.setHeight(0.1),
        borderColor: "rgba(50, 89, 98, 0.5)",
        borderRadius: Display.setHeight(5),
    },
});

export default AddressAccessScreen