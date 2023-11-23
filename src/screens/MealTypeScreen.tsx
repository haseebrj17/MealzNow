import { View, Text, TouchableOpacity, Image } from 'react-native'
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

type RootStackParamList = {
    MealTypeScreen: undefined;
};

type MealTypeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MealTypeScreen'>;

interface MealTypeScreenProps {
    navigation: MealTypeScreenNavigationProp;
}

const data = [
    {
        id: 0,
        title: 'Vegetarian',
        description: 'Vegetarian meals include plant-based foods and may contain dairy and eggs, but exclude meat and fish.',
        image: <Vegetarian color={theme.colors.custom[2].stromboli} />,
        aspectRatio: 225 / 225
    },
    {
        id: 1,
        title: 'Omnivore',
        description: 'Omnivore meals include a mix of plant-based foods and animal products, such as meat, dairy, and eggs.',
        image: <Omnivore color={theme.colors.custom[2].stromboli} />,
        aspectRatio: 500 / 625
    }
]

const MealTypeScreen: React.FC<MealTypeScreenProps> = ({ navigation }) => {

    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [disabled, setDisabled] = useState(true)

    const handleSelectedType = (id: number) => {
        setSelectedType(id);
        setDisabled(false); // This will enable the button
    };

    return (
        <View
            style={{ backgroundColor: theme.colors.background.bgGrayPurple }}
        >
            <Stepper
                title={'WHAT TYPE OF MEALS WOULD YOU PREFER?'}
                instruction={"Your diet plan might have foods you don't eat. We will put a warning sign next to those meals. This way, you can easily change them for other meals you like."}
                step={1}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={() => console.log('hello')}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.dark}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={disabled}
            >
                {data?.map((item) => {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={{
                                width: Display.setWidth(90),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                height: Display.setHeight(15),
                                backgroundColor: item.id === selectedType ? theme.colors.accent.light : theme.colors.accent.mediumGray,
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
                            onPress={() => handleSelectedType(item?.id)}
                        >
                            <View
                                style={{
                                    width: Display.setHeight(12),
                                    height: Display.setHeight(12),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {item.image}
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
                                        fontFamily: 'RC',
                                        fontWeight: '600',
                                        color: theme.colors.primary.dark
                                    }}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.5),
                                        fontFamily: 'RC',
                                        fontWeight: '600',
                                        color: theme.colors.accent.darkGray
                                    }}
                                >
                                    {item.description}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </Stepper>
        </View>
    )
}
export default MealTypeScreen


// width={Display.setWidth(90)}
//                     height={Display.setHeight(5)}
//                     onPress={() => console.log('hello')}
//                     title={'NEXT'}
//                     color={theme.colors.primary.dark}
//                     textColor={theme.colors.custom[8].moonraker}
//                     disabled={false}


//                     <Progress step={1} steps={6} height={Display.setHeight(1)} />
