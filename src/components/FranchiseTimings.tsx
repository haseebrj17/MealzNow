import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Display, formatTimeToAMPM } from '../utils';
import { theme } from '../theme/theme';
import Separator from './Separator';
import { Entypo, AntDesign } from "@expo/vector-icons";
import { CircleIcon, Radio, RadioIcon, RadioIndicator, RadioLabel, VStack, RadioGroup } from '@gluestack-ui/themed';
import { FranchiseTiming, FranchiseTimings, ServingDay } from '../types/franchise';
import { SelectedSlots } from '../types/slotsAndDates';

interface Props {
    selectedServingDays: ServingDay[];
    timingString: string | null;
    timings: FranchiseTimings;
    startDate: Date;
    selectedSlots: SelectedSlots;
    onSlotSelect: (day: string, mealType: 'Lunch' | 'Dinner', slotStart: string, slotId: string) => void;
}

const DaySlots: React.FC<Props> = ({ selectedServingDays, timingString, timings, startDate, onSlotSelect, selectedSlots }) => {

    // Convert selected serving days to a lookup map for efficiency
    const selectedDaysMap = selectedServingDays.reduce((acc, day) => {
        acc[day.Name] = day;
        return acc;
    }, {} as { [key: string]: ServingDay });

    const isDaySelected = (dayName: string) => {
        return selectedDaysMap.hasOwnProperty(dayName);
    };

    // Calculate the end date by adding 6 days to the start date
    const endDate = new Date(startDate.getTime());
    endDate.setDate(startDate.getDate() + 6);

    // Filter franchiseTimings to only include days within the selected week
    const timingsForWeek = timings.filter((timing) => {
        const dayDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        return dayDate >= startDate && dayDate <= endDate;
    });

    // Render each day slot
    const renderDaySlots = (day: FranchiseTiming) => {
        const isSelected = isDaySelected(day.Day);
        const showLunch = timingString && timingString.includes('Lunch');
        const showDinner = timingString && timingString.includes('Dinner');
        const lunchTiming = day.ServingTimings.find(t => t.Name === 'Lunch');
        const dinnerTiming = day.ServingTimings.find(t => t.Name === 'Dinner');

        const restaurantClosed = day.Open === false;

        const lunchSelected = selectedSlots[day.Day]?.Lunch;
        const dinnerSelected = selectedSlots[day.Day]?.Dinner;

        return (
            restaurantClosed ? (
                <>
                    <Text style={styles.mealTitle}>{day.Day}</Text>
                    <View
                        key={day.Id}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: Display.setWidth(80),
                            marginTop: Display.setHeight(1),
                            paddingLeft: theme.padding.large,
                            marginBottom: Display.setHeight(2)
                        }}
                    >
                        <Text
                            key={`message-${day.Id}`}
                            style={{
                                color: theme.colors.accent.disabledGray,
                                fontWeight: '500',
                                fontSize: Display.setHeight(1.6),
                            }}
                        >We are not currently open on {day.Day}</Text>
                    </View>
                    <View
                        style={styles.Container}
                    >
                        <View key={day.Id} style={[styles.TimingContainer, {
                            height: Display.setHeight(13),
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            width: Display.setWidth(70),
                            marginTop: Display.setHeight(1),
                            paddingLeft: theme.padding.large
                        }]}>
                            <Text style={[styles.radio, {
                                marginBottom: Display.setHeight(1)
                            }]}>
                                <Entypo name='circle' color={theme.colors.accent.borderGray} size={Display.setHeight(2)} />  11:00 AM
                            </Text>
                            <Text style={[styles.radio, {
                                marginBottom: Display.setHeight(1)
                            }]}>
                                <Entypo name='circle' color={theme.colors.accent.borderGray} size={Display.setHeight(2)} />  12:00 PM
                            </Text>
                            <Text style={[styles.radio, {
                                marginBottom: Display.setHeight(1)
                            }]}>
                                <Entypo name='circle' color={theme.colors.accent.borderGray} size={Display.setHeight(2)} />  01:00 PM
                            </Text>
                        </View>
                        <BlurView
                            style={[styles.absolute, {
                                width: Display.setWidth(100),
                                height: Display.setHeight(17),
                            }]}
                            tint="light"
                            intensity={20}
                        />
                    </View>
                </>
            ) :
                isSelected ? (
                    <>
                        <Text style={styles.mealTitle}>{day.Day}</Text>

                        <View key={day.Id} style={styles.Container}>
                            {lunchTiming && showLunch && (
                                <View style={styles.TimingContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            backgroundColor: theme.colors.background.bgGrayGreen,
                                        }}
                                    >
                                        <Text style={styles.timingTitle}>Lunch</Text>
                                        <Separator
                                            width={'100%'}
                                            height={Display.setHeight(0.1)}
                                            color={theme.colors.accent.mediumGray}
                                        />
                                    </View>
                                    <RadioGroup
                                        value={lunchSelected?.Id || lunchTiming.ServingTime[0].Id}
                                        onChange={(value) => {
                                            const selectedSlot = lunchTiming.ServingTime.find(slot => slot.Id === value);
                                            if (selectedSlot) {
                                                onSlotSelect(day.Day, 'Lunch', selectedSlot.SlotStart, selectedSlot.Id);
                                            }
                                        }}
                                    >
                                        <VStack
                                            space="lg"
                                            style={styles.Vstack}
                                        >
                                            {lunchTiming.ServingTime.map((slot) => (
                                                <Radio
                                                    key={slot.Id}
                                                    value={slot.Id}
                                                >
                                                    <RadioIndicator mr="$2">
                                                        <RadioIcon
                                                            as={() => <CircleIcon
                                                                color={theme.colors.accent.gray} />}
                                                        />
                                                    </RadioIndicator>
                                                    <RadioLabel>
                                                        {`${formatTimeToAMPM(slot.SlotStart)} - ${formatTimeToAMPM(slot.SlotEnd)}`}
                                                    </RadioLabel>
                                                </Radio>
                                            ))}
                                        </VStack>
                                    </RadioGroup>
                                </View>
                            )}
                            {dinnerTiming && showDinner && (
                                <View style={styles.TimingContainer}>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            backgroundColor: theme.colors.background.bgGrayGreen,
                                        }}
                                    >
                                        <Text style={styles.timingTitle}>Dinner</Text>
                                        <Separator
                                            width={'100%'}
                                            height={Display.setHeight(0.1)}
                                            color={theme.colors.accent.mediumGray}
                                        />
                                    </View>
                                    <RadioGroup
                                        value={dinnerSelected?.Id || dinnerTiming.ServingTime[0].Id}
                                        onChange={(value) => {
                                            const selectedSlot = dinnerTiming.ServingTime.find(slot => slot.Id === value);
                                            if (selectedSlot) {
                                                onSlotSelect(day.Day, 'Dinner', selectedSlot.SlotStart, selectedSlot.Id);
                                            }
                                        }}
                                    >
                                        <VStack
                                            space="lg"
                                            style={styles.Vstack}
                                        >
                                            {dinnerTiming.ServingTime.map((slot) => (
                                                <Radio
                                                    key={slot.Id}
                                                    value={slot.Id}
                                                >
                                                    <RadioIndicator
                                                        mr="$2">
                                                        <RadioIcon
                                                            as={() => <CircleIcon
                                                                color={theme.colors.accent.gray} />}
                                                        />
                                                    </RadioIndicator>
                                                    <RadioLabel>
                                                        {`${formatTimeToAMPM(slot.SlotStart)} - ${formatTimeToAMPM(slot.SlotEnd)}`}
                                                    </RadioLabel>
                                                </Radio>
                                            ))}
                                        </VStack>
                                    </RadioGroup>
                                </View>
                            )}
                        </View>
                    </>
                ) : (
                    <><Text style={styles.mealTitle}>{day.Day}</Text>
                        <View
                            key={day.Id}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: Display.setWidth(80),
                                marginTop: Display.setHeight(1),
                                paddingLeft: theme.padding.large,
                                marginBottom: Display.setHeight(4)
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.accent.disabledGray,
                                    fontSize: Display.setHeight(1.5),
                                }}
                            >You didn't choose this day</Text>
                            <TouchableOpacity
                                onPress={() => console.log('add it')}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.accent.disabledGray,
                                        fontSize: Display.setHeight(1.4),
                                        fontWeight: 'bold',
                                        marginRight: Display.setWidth(1.5)
                                    }}
                                >Add it</Text>
                                <AntDesign name="pluscircle" size={Display.setHeight(2.5)} color={theme.colors.custom[2].stromboli} />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={styles.Container}
                        >
                            <View key={day.Id} style={[styles.TimingContainer, {
                                height: Display.setHeight(13),
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                width: Display.setWidth(70),
                                marginTop: Display.setHeight(1),
                                paddingLeft: theme.padding.large
                            }]}>
                                <Text style={[styles.radio, {
                                    marginBottom: Display.setHeight(1)
                                }]}>
                                    <Entypo name='circle' color={theme.colors.accent.borderGray} size={Display.setHeight(2)} />  11:00 AM
                                </Text>
                                <Text style={[styles.radio, {
                                    marginBottom: Display.setHeight(1)
                                }]}>
                                    <Entypo name='circle' color={theme.colors.accent.borderGray} size={Display.setHeight(2)} />  12:00 PM
                                </Text>
                                <Text style={[styles.radio, {
                                    marginBottom: Display.setHeight(1)
                                }]}>
                                    <Entypo name='circle' color={theme.colors.accent.borderGray} size={Display.setHeight(2)} />  01:00 PM
                                </Text>
                            </View>
                            <BlurView
                                style={[styles.absolute, {
                                    width: Display.setWidth(100),
                                    height: Display.setHeight(17),
                                }]}
                                tint="light"
                                intensity={20}
                            />
                        </View>
                    </>
                )
        );
    };

    return (
        <>
            {timings.map((day) => renderDaySlots(day))}
        </>
    );
};

const styles = StyleSheet.create({
    Container: {
        width: Display.setWidth(80),
        marginBottom: Display.setHeight(2),
        paddingLeft: theme.padding.large,
    },
    TimingContainer: {
        backgroundColor: theme.colors.background.bgGrayGreen,
        borderBottomLeftRadius: Display.setHeight(2),
        borderBottomRightRadius: Display.setHeight(2),
        borderWidth: Display.setHeight(0.05),
        borderColor: theme.colors.background.bgGrayGreen,
        shadowColor: theme.colors.primary.dark,
        shadowOffset: {
            width: 3,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 9,
        marginBottom: Display.setHeight(1),
        marginTop: Display.setHeight(2)
    },
    mealTitle: {
        fontWeight: '500',
        color: theme.colors.primary.dark,
        fontSize: Display.setHeight(2.5),
        marginTop: Display.setHeight(3),
        paddingLeft: theme.padding.small
    },
    timingTitle: {
        fontWeight: 'bold',
        fontSize: Display.setHeight(2),
        color: theme.colors.primary.dark,
        paddingLeft: theme.padding.medium,
        paddingTop: theme.padding.small,
        paddingBottom: theme.padding.small
    },
    Vstack: {
        paddingLeft: theme.padding.large,
        paddingVertical: theme.padding.small
    },
    radio: {
    },
    radioText: {
        fontSize: Display.setHeight(1.8),
        color: theme.colors.primary.dark,
        fontWeight: '500'
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    dayContainer: {
        width: Display.setWidth(90),
        backgroundColor: theme.colors.background.bgGrayGreen,
        borderRadius: Display.setHeight(1.3),
        borderWidth: Display.setHeight(0.05),
        borderColor: theme.colors.background.bgGrayGreen,
        shadowColor: theme.colors.primary.dark,
        shadowOffset: {
            width: 2,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayContainerBlurred: {
        width: Display.setWidth(90),
        height: Display.setHeight(10),
        backgroundColor: theme.colors.background.bgGrayGreen,
        borderRadius: Display.setHeight(1.3),
        borderWidth: Display.setHeight(0.05),
        borderColor: theme.colors.background.bgGrayGreen,
        shadowColor: theme.colors.primary.dark,
        shadowOffset: {
            width: 2,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: 0.5
    }
});

export default DaySlots;
