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

interface SlotDetail {
    Id: string;
    Time: string;
}

interface DayWithDateAndSlots extends DayWithDate {
    dayId: string;
    slots: MealSelection;
}

interface MealSelection {
    Lunch?: SlotDetail;
    Dinner?: SlotDetail;
}

interface SelectedSlots {
    [day: string]: MealSelection;
}

interface ServingDays {
    Id: string,
    Name: string,
}


interface ServingTimeSlot {
    Id: string;
    SlotStart: string;
    SlotEnd: string;
}

interface ServingTiming {
    Id: string;
    Name: string;
    ServingTime: ServingTimeSlot[];
}

interface FranchiseTiming {
    Id: string;
    Day: string;
    OpeningTime: string;
    ClosingTime: string;
    Open: boolean;
    ServingTimings: ServingTiming[];
}

type FranchiseTimings = FranchiseTiming[];

type RootStackParamList = {
    StartDateAndSlots: {
        packageId: string | null,
        selectedServingDays: ServingDays[]
    };
    Meals: {
        packageId: string | null,
        generatedDates: DayWithDateAndSlots[] | null
    };
};

type StartDateAndSlotsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StartDateAndSlots'>;

interface StartDateAndSlotsScreenProps {
    navigation: StartDateAndSlotsScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'StartDateAndSlots'>;
}
const StartDateAndSlotsScreen: React.FC<StartDateAndSlotsScreenProps> = ({ navigation, route }) => {

    const { franchiseTimings, franchiseSetting, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [disabled, setDisabled] = useState(true)
    const [date, setDate] = useState<Date>(fDateAdd(new Date(), 1));
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [timing, setTiming] = useState<string | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlots>({});
    const [numberOfWeeks, setNumberOfWeeks] = useState<number | null>(null);

    const initializeSelectedSlots = (servingDays: ServingDays[], franchiseTimings: FranchiseTimings, timing: string | null): SelectedSlots => {
        const initialSlots: SelectedSlots = {};
        servingDays.forEach(day => {
            const dayTiming = franchiseTimings.find(t => t.Day === day.Name);
            const showLunch = timing?.includes('Lunch');
            const showDinner = timing?.includes('Dinner');
            const lunchTiming = showLunch ? dayTiming?.ServingTimings.find(t => t.Name === 'Lunch')?.ServingTime[0] : undefined;
            const dinnerTiming = showDinner ? dayTiming?.ServingTimings.find(t => t.Name === 'Dinner')?.ServingTime[0] : undefined;

            initialSlots[day.Name] = {
                Lunch: lunchTiming ? { Id: lunchTiming.Id, Time: lunchTiming.SlotStart } : undefined,
                Dinner: dinnerTiming ? { Id: dinnerTiming.Id, Time: dinnerTiming.SlotStart } : undefined
            };
        });
        return initialSlots;
    };

    useEffect(() => {
        if (route?.params?.selectedServingDays && franchiseTimings && timing) {
            const initialSlots = initializeSelectedSlots(route?.params?.selectedServingDays, franchiseTimings, timing);
            setSelectedSlots(initialSlots);
        }
    }, [route?.params?.selectedServingDays, franchiseTimings, timing]);

    const updateSelectedSlot = (day: string, mealType: 'Lunch' | 'Dinner', slotStart: string, slotId: string) => {
        setSelectedSlots((prevSlots: SelectedSlots) => ({
            ...prevSlots,
            [day]: {
                ...prevSlots[day],
                [mealType]: { Time: slotStart, Id: slotId }
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
                    const daySlots = selectedSlots[dayName];
                    let slotDetails: MealSelection = {};

                    if (daySlots?.Lunch) {
                        slotDetails.Lunch = daySlots.Lunch;
                    }
                    if (daySlots?.Dinner) {
                        slotDetails.Dinner = daySlots.Dinner;
                    }

                    dates.push({
                        dayName,
                        dayId: dayObj.Id,
                        date: currentDate.toISOString().split('T')[0],
                        slots: slotDetails
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

            // Navigate to the Meals screen with generatedDates
            navigation.navigate('Meals', { packageId: route?.params?.packageId as string, generatedDates: generatedDates as DayWithDateAndSlots[] });
        } else {
            // Handle the case where slots are not properly filled
            alert("Please ensure all slots are filled correctly.");
        }
    };
    const validateSlots = () => {
        let isValid = true;

        console.log(selectedSlots);

        for (const day of route?.params?.selectedServingDays || []) {
            const daySlots = selectedSlots[day.Name];

            // If 'Lunch' is part of the timing string, check if lunch is selected
            if (timing?.includes('Lunch') && !daySlots?.Lunch) {
                isValid = false;
                break;
            }

            // If 'Dinner' is part of the timing string, check if dinner is selected
            if (timing?.includes('Dinner') && !daySlots?.Dinner) {
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
        hideDatePicker();
    };

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
                buttonColor={theme.colors.primary.darker}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={!validateSlots()}
                details={"Select the date you want to start your subscription from and your preferred delivery time."}
            >
                <ScrollView>
                    <View
                        style={{
                            marginTop: Display.setHeight(1.5),
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
                            marginBottom: Display.setHeight(10),
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
                        display='inline'
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        minimumDate={fDateAdd(new Date(), 1)}
                        modalPropsIOS={
                            {
                                animationType: 'fade',
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