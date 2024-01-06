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
    date: string;
}

interface DayWithDateAndSlots extends DayWithDate {
    dayId: string;
    slots: MealSelection;
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
    Meals: { packageId: string | null, generatedDates: DayWithDateAndSlots[] | null };
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
    const [numberOfWeeks, setNumberOfWeeks] = useState<number | null>(null);

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
        selectedDays: ServingDays[],
        numberOfWeeks: number,
        selectedSlots: SelectedSlots
    ): DayWithDateAndSlots[] => {
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const selectedDayNames = selectedDays.map(day => day.Name);
        const dates: DayWithDateAndSlots[] = [];
        let currentDate = new Date(startDate);

        for (let week = 0; week < numberOfWeeks; week++) {
            for (let day = 0; day < 7; day++) {
                const dayName = dayNames[currentDate.getDay()];
                const dayObj = selectedDays.find(d => d.Name === dayName);
                if (dayObj && selectedDayNames.includes(dayName)) {
                    dates.push({
                        dayName,
                        dayId: dayObj.Id,
                        date: new Date(currentDate).toString(),
                        slots: selectedSlots[dayName] || {}
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        return dates;
    };

    const handleNavigation = () => {
        if (validateSlots()) {
            const generatedDates = generateDatesForSelectedDays(
                date,
                route?.params?.selectedServingDays || [],
                numberOfWeeks || 1,
                selectedSlots
            );
            console.log('generatedDates:', generatedDates);

            // Navigate to the Meals screen with generatedDates
            navigation.navigate('Meals', { packageId: route?.params?.packageId, generatedDates: generatedDates });
        } else {
            // Handle the case where slots are not properly filled
            alert("Please ensure all slots are filled correctly.");
        }
    };

    const validateSlots = () => {
        let isValid = true;

        // Extract the days when only lunch or only dinner is served
        const daysWithOnlyLunch = franchiseTimings.filter(t => t.Open && t.ServingTimings.some(st => st.Name === 'Lunch') && !t.ServingTimings.some(st => st.Name === 'Dinner')).map(t => t.Day);
        const daysWithOnlyDinner = franchiseTimings.filter(t => t.Open && t.ServingTimings.some(st => st.Name === 'Dinner') && !t.ServingTimings.some(st => st.Name === 'Lunch')).map(t => t.Day);

        for (let day of route?.params?.selectedServingDays || []) {
            const daySlots = selectedSlots[day.Name];
            const isLunchRequired = timing?.includes('Lunch') && !daysWithOnlyDinner.includes(day.Name); // Check if lunch is required and the day is not a dinner-only day
            const isDinnerRequired = timing?.includes('Dinner') && !daysWithOnlyLunch.includes(day.Name); // Check if dinner is required and the day is not a lunch-only day

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
    }, [route.params.selectedServingDays]);

    const { franchiseTimings, franchiseSetting, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    useEffect(() => {
        let timing: number | any[] | null = null;
        const timings = async () => {
            await getDataFromTable(
                "CustomerPackage",
                ["timings", "numberOfWeeks"],
                "packageId = ?",
                [route?.params?.packageId]
            ).then(data => {
                timing = data[0]?.timings;
                const timingString: string | null = franchiseSetting?.MealsPerDay.find((meal) => meal.Timings === timing)?.Title ?? null;
                setTiming(timingString);
                setNumberOfWeeks(data[0]?.numberOfWeeks);
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
                step={6}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={handleNavigation}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.dark}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={!validateSlots()}
                details={"Select the date you want to start your subscription from and your preferred delivery time."}
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