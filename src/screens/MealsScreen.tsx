import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { Children, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'; // or NavigationProp from '@react-navigation/native'
import { Stepper } from '../components'
import { theme } from '../theme/theme';
import { useFonts } from '../hooks/useFonts';
import { Display } from '../utils';
import Vegetarian from '../assets/icons/Vegetarian';
import Omnivore from '../assets/icons/Omnivore';
import { useDispatch } from 'react-redux';
import { setFlashMessage } from '../features/flashMessages/flashMessageSlice';
import FlashMessage from '../components/flashMessage';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

type RootStackParamList = {
    MealsScreenProps: undefined;
};

type MealsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PreferredCuisineScreen'>;

interface MealsScreenProps {
    navigation: MealsScreenNavigationProp;
}

const data = [
    {
        id: 0,
        title: 'Mon',
    },
    {
        id: 1,
        title: 'Tue',
    },
    {
        id: 2,
        title: 'Wed',
    },
    {
        id: 3,
        title: 'Thu',
    },
    {
        id: 4,
        title: 'Fri',
    },
    {
        id: 5,
        title: 'Sat',
    },
    {
        id: 6,
        title: 'Sun',
    },
]

const MealsScreen: React.FC<MealsScreenProps> = ({ navigation }) => {

    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [disabled, setDisabled] = useState(true)

    const [weekCount, setWeekCount] = useState(2);

    const incrementWeekCount = () => {
        setWeekCount(weekCount + 1);
    }

    const decrementWeekCount = () => {
        if (weekCount === 2) return;
        setWeekCount(weekCount - 1);
    }

    const handleSelectedType = (id: number) => {
        let updatedSelectedTypes = [];

        if (selectedTypes.includes(id)) {
            updatedSelectedTypes = selectedTypes.filter(type => type !== id);
        } else {
            updatedSelectedTypes = [...selectedTypes, id];
        }

        setSelectedTypes(updatedSelectedTypes);

        setDisabled(updatedSelectedTypes.length < 3);
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
                onPress={() => console.log('hello')}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.dark}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={disabled}
                details={"Minimum 3 days a week."}
            >
                <FlatList
                    contentContainerStyle={{
                        width: Display.setWidth(100),
                        marginTop: Display.setHeight(2),
                        height: Display.setHeight(50),
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.id}
                            style={{
                                width: Display.setWidth(20),
                                height: Display.setWidth(20),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                backgroundColor: selectedTypes.includes(item.id) ? theme.colors.accent.light : theme.colors.accent.mediumGray,
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
                            onPress={() => handleSelectedType(item?.id)}
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
                                        fontWeight: '400',
                                        color: theme.colors.primary.dark
                                    }}
                                >
                                    {item.title}
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
                                >Minimum 3 weeks.</Text>
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
                    numColumns={4}
                />

            </Stepper >
        </View >
    )
}

export default MealsScreen;


