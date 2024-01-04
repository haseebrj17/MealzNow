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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { logAllTables } from '../db/DataLog';
import { AppDispatch, RootState } from '../Store';
import { insertCustomerPromo, insertOrUpdateCustomerPackage } from '../db/methods/custmerNestedOperations';
import { insertCustomerOrderPromo, insertOrUpdateCustomerOrderedPackage } from '../db/methods/cartNestedOperations';

type RootStackParamList = {
    MealPerDayScreenProps: undefined;
    DeliveriesPerWeek:  { packageId: string | null };
};

type MealPerDayScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DeliveriesPerWeek'>;

interface MealPerDayScreenProps {
    navigation: MealPerDayScreenNavigationProp;
}

const MealPerDayScreen: React.FC<MealPerDayScreenProps> = ({ navigation }) => {

    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disabled, setDisabled] = useState(true)
    const [mealzPeyDay, setMealzPerDay] = useState<any[]>([]);

    const handleSelectedType = (Id: string) => {
        setSelectedType(Id);
        setDisabled(false);
    };

    // useEffect(() => {
    //     logAllTables();
    // }, []);

    const dispatch = useDispatch<AppDispatch>();

    const { franchiseSetting, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    const insertData = async () => {
        const mealz = mealzPeyDay.find(item => item?.Id === selectedType);
        if (!mealz) {
            console.error("MealzPerDay not found");
            return;
        }

        await handlePromoInsertion(mealz);
        await handlePackageInsertion(mealz);
    };

    const handlePromoInsertion = async (mealz: any) => {
        if (mealz.Discount > 0) {
            const promo = {
                type: mealz.Title,
                name: mealz.Title,
                percent: mealz.Discount
            };

            try {
                const rescop = await insertCustomerOrderPromo(promo);
                const rescp = await insertCustomerPromo(promo);
                console.log(`Order Promo: ${rescop}, Promo: ${rescp}`);
                if (!rescp || !rescop) {
                    console.error('Error inserting promo');
                }
            } catch (error) {
                console.error('Error handling promo insertion:', error);
            }
        }
    };

    const handlePackageInsertion = async (mealz: any) => {
        const packageData = {
            packageId: mealz.Id,
            timings: mealz.Timings
        };

        try {
            console.log("Package data before function call:", packageData);
            const rescp = await insertOrUpdateCustomerPackage(packageData);
            const rescop = await insertOrUpdateCustomerOrderedPackage(packageData);

            if (rescp && rescop) {
                navigation.navigate('DeliveriesPerWeek', { packageId: selectedType });
            } else {
                console.error('Error inserting packages');
            }
        } catch (error) {
            console.error('Error handling package insertion:', error);
        }
    };

    useEffect(() => {
        if (franchiseSetting?.MealsPerDay) {
            setMealzPerDay(franchiseSetting?.MealsPerDay);
        }
    }, [franchiseSetting, dispatch]);

    return (
        <View
            style={{ backgroundColor: theme.colors.background.bgGrayPurple }}
        >
            <Stepper
                title={'HOW MANY MEALS PER DAY?'}
                step={4}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={() => insertData()}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.dark}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={disabled}
            >
                {mealzPeyDay?.map((item) => {
                    return (
                        <TouchableOpacity
                            key={item.Id}
                            style={{
                                width: Display.setWidth(90),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                height: Display.setHeight(15),
                                backgroundColor: item.Id === selectedType ? theme.colors.accent.light : theme.colors.accent.mediumGray,
                                borderRadius: Display.setHeight(1.3),
                                shadowColor: theme.colors.primary.dark,
                                shadowOffset: {
                                    width: 4,
                                    height: 6,
                                },
                                shadowOpacity: 0.35,
                                shadowRadius: 5.5,
                                elevation: 9,
                                marginBottom: Display.setHeight(3),
                                paddingLeft: theme.padding.small,
                                paddingRight: theme.padding.small
                            }}
                            onPress={() => handleSelectedType(item?.Id)}
                        >
                            <View
                                style={{
                                    width: Display.setHeight(12),
                                    height: Display.setHeight(12),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image
                                    source={{ uri: item?.Icon }}
                                    style={{
                                        width: Display.setHeight(8),
                                        resizeMode: 'contain',
                                        aspectRatio: 1,
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    width: (Display.setWidth(90) - Display.setHeight(12)),
                                    height: '70%',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-evenly'
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(3.5),

                                        fontWeight: '600',
                                        color: theme.colors.primary.dark
                                    }}
                                >
                                    {item?.Title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.5),

                                        fontWeight: '600',
                                        color: theme.colors.accent.darkGray
                                    }}
                                >
                                    {item?.Description}
                                </Text>
                            </View>
                            {item?.Discount > 0 &&
                                <View
                                    style={{
                                        width: Display.setWidth(25),
                                        height: Display.setWidth(6),
                                        backgroundColor: theme.colors.custom[4].casablanca,
                                        borderRadius: Display.setHeight(1.5),
                                        position: 'absolute',
                                        top: '-8%',
                                        right: '5%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly'
                                    }}
                                >
                                    <MaterialCommunityIcons name="brightness-percent" size={Display.setHeight(1.8)} color={theme.colors.primary.dark} />
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.5),
                                            fontWeight: '600',
                                            color: theme.colors.primary.dark,
                                        }}
                                    >
                                        Saves {item?.Discount}%
                                    </Text>
                                </View>
                            }
                        </TouchableOpacity>
                    )
                })}
            </Stepper>
        </View>
    )
}

export default MealPerDayScreen;
