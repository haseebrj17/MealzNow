import { View, Text, TouchableOpacity, Image, FlatList, Pressable } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'; // or NavigationProp from '@react-navigation/native'
import { Separator, Stepper } from '../components'
import { theme } from '../theme/theme';
import { useFonts } from '../hooks/useFonts';
import { Display, fDateAdd, fDateVerbose } from '../utils';
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
import { RouteProp } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getDataFromTable } from '../db/methods/common';
import DaySlots from '../components/FranchiseTimings';
import { ScrollView } from 'react-native-gesture-handler';

interface DayWithDate {
    dayName: string;
    date: Date;
}

interface MealSelection {
    Lunch?: string;
    Dinner?: string;
}

interface SelectedSlots {
    [day: string]: MealSelection;
}

interface ServingDays {
    Id: string,
    Name: string,
}

interface Slot {
    Id: string;
    SlotStart: string;
    SlotEnd: string;
}

type RootStackParamList = {
    StartDateAndSlotsScreenProps: { packageId: string, selectedServingDays: ServingDays[] };
    Meals: { packageId: string | null };
};

type StartDateAndSlotsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Meals'>;

interface StartDateAndSlotsScreenProps {
    navigation: StartDateAndSlotsScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'StartDateAndSlotsScreenProps'>;
}

const StartDateAndSlotsScreen: React.FC<StartDateAndSlotsScreenProps> = ({ navigation, route }) => {

    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [disabled, setDisabled] = useState(true)
    const [date, setDate] = useState<Date>(fDateAdd(new Date(), 1));
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [timing, setTiming] = useState<string | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlots>({});

    const updateSelectedSlot = (day: string, mealType: 'Lunch' | 'Dinner', slotStart: string) => {
        setSelectedSlots((prevSlots: SelectedSlots) => ({
            ...prevSlots,
            [day]: {
                ...prevSlots[day],
                [mealType]: slotStart
            }
        }));
    };

    const generateDatesForSelectedDays = (
        startDate: Date,
        selectedDays: ServingDays[]
    ): DayWithDate[] => {
        const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const selectedDayNames = selectedDays.map(day => day.Name);
        const dates: DayWithDate[] = [];
        let currentDate = new Date(startDate);

        for (let i = 0; i < 7; i++) {
            const dayName = dayNames[currentDate.getDay()];
            if (selectedDayNames.includes(dayName)) {
                dates.push({
                    dayName,
                    date: new Date(currentDate)
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };

    useEffect(() => {
        console.log(generateDatesForSelectedDays(date, route?.params?.selectedServingDays || []))
    }, [route?.params?.selectedServingDays, date]);

    const validateSlots = () => {
        let isValid = true;

        for (let day of route?.params?.selectedServingDays || []) {
            const daySlots = selectedSlots[day.Name];
            const isLunchRequired = timing?.includes('Lunch');
            const isDinnerRequired = timing?.includes('Dinner');

            if ((isLunchRequired && !daySlots?.Lunch) || (isDinnerRequired && !daySlots?.Dinner)) {
                isValid = false;
                break;
            }
        }

        return isValid;
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        setDate(date);
        console.log("A date has been picked: ", date);
        hideDatePicker();
    };

    useEffect(() => {
        logAllTables();
        console.log('route.params.selectedServingDays', route.params.selectedServingDays);
    }, [route.params.selectedServingDays]);

    const { franchiseTimings, franchiseSetting, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    useEffect(() => {
        let timing: number | any[] | null = null;
        const timings = async () => {
            await getDataFromTable(
                "CustomerPackage",
                ["timings"],
                "packageId = ?",
                [route?.params?.packageId]
            ).then(data => {
                timing = data[0]?.timings;
                const timingString: string | null = franchiseSetting?.MealsPerDay.find((meal) => meal.Timings === timing)?.Title ?? null;
                setTiming(timingString);
                console.log('timingString', timingString);
            }).catch(error => {
                console.error(error);
            });
        }

        timings();
    }, [route?.params?.packageId, franchiseSetting]);

    return (
        <View
            style={{ backgroundColor: theme.colors.background.bgGrayPurple }}
        >
            <Stepper
                title={'choose starting date and your preferred delivery time.'}
                step={5}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={() => console.log('hello')}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.dark}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={disabled}
                details={""}
            >
                <ScrollView>
                    <View
                        style={{
                            marginTop: Display.setHeight(1.5),
                            marginBottom: Display.setHeight(1),
                            width: Display.setWidth(90),
                            alignSelf: 'center',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Display.setHeight(2.5),
                                fontWeight: '500',
                                marginTop: Display.setHeight(2),
                                marginBottom: Display.setHeight(1),
                                color: theme.colors.primary.darker,
                            }}
                        >Starting Date</Text>
                        <Separator
                            color={theme.colors.accent.mediumGray}
                            width={Display.setWidth(90)}
                            height={Display.setHeight(0.1)}
                        />
                        <TouchableOpacity
                            style={{
                                marginTop: Display.setHeight(1.5),
                                width: Display.setWidth(85),
                                height: Display.setHeight(5),
                                borderRadius: Display.setHeight(1.3),
                                borderWidth: Display.setHeight(0.05),
                                borderColor: theme.colors.accent.borderGray,
                                backgroundColor: theme.colors.accent.lightGray,
                                shadowColor: theme.colors.primary.dark,
                                shadowOffset: {
                                    width: 2,
                                    height: 3,
                                },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                                elevation: 3,
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'space-between',
                            }}
                            onPress={showDatePicker}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(2),
                                    fontWeight: '500',
                                    color: theme.colors.accent.textGray,
                                    paddingLeft: theme.padding.medium,
                                    paddingRight: theme.padding.medium
                                }}
                            >
                                {date ? fDateVerbose(date) : ''}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            marginTop: Display.setHeight(1),
                            marginBottom: Display.setHeight(1),
                            width: Display.setWidth(90),
                            alignSelf: 'center',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: Display.setHeight(2.5),
                                fontWeight: '500',
                                marginTop: Display.setHeight(2),
                                marginBottom: Display.setHeight(1),
                                color: theme.colors.primary.darker,
                            }}
                        >Delivery Time</Text>
                        <Separator
                            color={theme.colors.accent.mediumGray}
                            width={Display.setWidth(90)}
                            height={Display.setHeight(0.1)}
                        />
                        <DaySlots
                            selectedServingDays={route?.params?.selectedServingDays}
                            timingString={timing ? timing : null}
                            timings={franchiseTimings ? franchiseTimings : []}
                            startDate={date ? date : fDateAdd(new Date(), 1)}
                            onSlotSelect={updateSelectedSlot}
                            selectedSlots={selectedSlots}
                        />
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        minimumDate={fDateAdd(new Date(), 1)}
                        modalPropsIOS={
                            {
                                animationType: 'fade',
                                transparent: true,
                                statusBarTranslucent: true,
                                backdropOpacity: 0.4,
                                backdropColor: theme.colors.background.bgGrayPurple,
                            }
                        }
                    />
                </ScrollView>
            </Stepper>
        </View>
    )
}

export default StartDateAndSlotsScreen;