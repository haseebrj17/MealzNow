import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'; // or NavigationProp from '@react-navigation/native'
import { Stepper } from '../components'
import { theme } from '../theme/theme';
import { useFonts } from '../hooks/useFonts';
import { Display } from '../utils';
import Vegetarian from '../assets/icons/Vegetarian';
import Omnivore from '../assets/icons/Omnivore';
import { useDispatch, useSelector } from 'react-redux';
import { setFlashMessage } from '../features/flashMessages/flashMessageSlice';
import FlashMessage from '../components/flashMessage';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { RootState } from '../Store';
import { updateCustomerPackage } from '../features/customer/customerSlice';
import { ServingDay } from '../types/franchise';
import { updateCustomerOrderedPackage } from '../features/cart/cartSlice';

type RootStackParamList = {
    DeliveriesPerWeek: { packageId: string | null };
    StartDateAndSlots: { packageId: string | null, selectedServingDays: ServingDay[] };
};

type DeliveriesPerWeekScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DeliveriesPerWeek'>;

interface DeliveriesPerWeekScreenProps {
    navigation: DeliveriesPerWeekScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'DeliveriesPerWeek'>;
}

const DeliveriesPerWeekScreen: React.FC<DeliveriesPerWeekScreenProps> = ({ navigation, route }) => {

    const dispatch = useDispatch();

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [disabled, setDisabled] = useState(true)
    const [packageId, setPackageId] = useState<string | null>(route?.params?.packageId);
    const [servingDays, setServingDays] = useState<any[]>([]);

    const [weekCount, setWeekCount] = useState(2);

    const incrementWeekCount = () => {
        setWeekCount(weekCount + 1);
    }

    const decrementWeekCount = () => {
        if (weekCount === 2) return;
        setWeekCount(weekCount - 1);
    }

    const { customer } = useSelector(
        (state: RootState) => state.customer
    );

    const { franchiseSetting, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    useEffect(() => {
        if (franchiseSetting?.ServingDays) {
            setServingDays(franchiseSetting?.ServingDays);
        }
    }, [franchiseSetting]);

    const handleSelectedType = (Id: string) => {
        let updatedSelectedTypes = [];

        if (selectedTypes.includes(Id)) {
            updatedSelectedTypes = selectedTypes.filter(type => type !== Id);
        } else {
            updatedSelectedTypes = [...selectedTypes, Id];
        }

        setSelectedTypes(updatedSelectedTypes);

        setDisabled(updatedSelectedTypes.length < 3);
    };

    const handleNext = async () => {
        if (!packageId || selectedTypes.length < 3 || weekCount < 2) return;

        const packageData = {
            packageId: customer?.customerPackage?.packageId ?? '',
            packageName: '',
            timings: customer?.customerPackage?.timings ?? 0,
            totalNumberOfMeals: 0,
            numberOfDays: selectedTypes.length * weekCount,
            numberOfWeeks: weekCount,
            mealzPerDay: customer?.customerPackage?.mealzPerDay ?? '',
        };

        const selectedServingDays = servingDays.filter(day => selectedTypes.includes(day.Id));

        try {
            dispatch(updateCustomerPackage(packageData));
            dispatch(updateCustomerOrderedPackage(packageData));
            console.log("Package data updated in Redux state");

            navigation.navigate('StartDateAndSlots', { packageId: packageId, selectedServingDays: selectedServingDays });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View
            style={{ backgroundColor: theme.colors.background.bgGrayPurple }}
        >
            <Stepper
                title={'HOW MANY DELIVERIES PER WEEK?'}
                step={5}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={() => handleNext()}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.darker}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={disabled}
                details={"Minimum 3 days a week."}
            >
                <FlatList
                    contentContainerStyle={{
                        width: Display.setWidth(100),
                        marginTop: Display.setHeight(2),
                        height: Display.setHeight(60),
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                    data={servingDays ? servingDays : []}
                    numColumns={4}
                    keyExtractor={(item) => item.Id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.Id}
                            style={{
                                width: Display.setWidth(20),
                                height: Display.setWidth(20),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                backgroundColor: selectedTypes.includes(item?.Id) ? theme.colors.accent.light : theme.colors.accent.mediumGray,
                                borderRadius: Display.setHeight(1.3),
                                shadowColor: theme.colors.primary.dark,
                                shadowOffset: {
                                    width: 2,
                                    height: 6,
                                },
                                shadowOpacity: 0.35,
                                shadowRadius: 5.5,
                                elevation: 9,
                                marginBottom: Display.setHeight(3),
                                paddingLeft: theme.padding.small,
                                paddingRight: theme.padding.small,
                                marginLeft: Display.setWidth(2),
                                marginRight: Display.setWidth(2),
                            }}
                            onPress={() => handleSelectedType(item?.Id)}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(2.5),
                                        fontWeight: '600',
                                        color: theme.colors.primary.dark
                                    }}
                                >
                                    {item?.Name ? item.Name.slice(0, 3) : ''}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={() => {
                        return (
                            <View
                                style={{
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    width: Display.setWidth(90),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(3.5),
                                        fontWeight: '700',
                                        marginTop: Display.setHeight(2),
                                        color: theme.colors.primary.darker,
                                    }}
                                >
                                    HOW MANY WEEKS TO DELIVER?
                                </Text>
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.7),

                                        fontWeight: '400',
                                        marginTop: Display.setHeight(0.5),
                                        color: theme.colors.primary.darker,
                                    }}
                                >Minimum 2 weeks.</Text>
                                <View
                                    style={{
                                        marginTop: Display.setHeight(3),
                                        width: Display.setWidth(90),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: Display.setWidth(10),
                                            height: Display.setWidth(10),
                                            backgroundColor: theme.colors.accent.light,
                                            borderRadius: Display.setHeight(1.3),
                                            shadowColor: theme.colors.primary.dark,
                                            shadowOffset: {
                                                width: 2,
                                                height: 6,
                                            },
                                            shadowOpacity: 0.35,
                                            shadowRadius: 5.5,
                                            elevation: 9,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() => decrementWeekCount()}
                                    >
                                        <AntDesign name="minus" size={Display.setHeight(4)} color={theme.colors.primary.dark} />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            width: Display.setWidth(15),
                                            height: Display.setWidth(15),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            backgroundColor: theme.colors.accent.mediumGray,
                                            borderRadius: Display.setHeight(1.3),
                                            shadowColor: theme.colors.primary.dark,
                                            shadowOffset: {
                                                width: 2,
                                                height: 6,
                                            },
                                            shadowOpacity: 0.35,
                                            shadowRadius: 5.5,
                                            elevation: 9,
                                            paddingLeft: theme.padding.small,
                                            paddingRight: theme.padding.small,
                                            marginLeft: Display.setWidth(4),
                                            marginRight: Display.setWidth(4),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: Display.setHeight(3.5),

                                                fontWeight: '400',
                                                color: theme.colors.primary.dark
                                            }}
                                        >
                                            {weekCount}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            width: Display.setWidth(10),
                                            height: Display.setWidth(10),
                                            backgroundColor: theme.colors.accent.light,
                                            borderRadius: Display.setHeight(1.3),
                                            shadowColor: theme.colors.primary.dark,
                                            shadowOffset: {
                                                width: 2,
                                                height: 6,
                                            },
                                            shadowOpacity: 0.35,
                                            shadowRadius: 5.5,
                                            elevation: 9,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() => incrementWeekCount()}
                                    >
                                        <AntDesign name="plus" size={Display.setHeight(4)} color={theme.colors.primary.dark} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                />

            </Stepper >
        </View >
    )
}

export default DeliveriesPerWeekScreen;
