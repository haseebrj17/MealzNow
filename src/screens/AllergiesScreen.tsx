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
import { RouteProp } from '@react-navigation/native';
import { RootState } from '../Store';
import { MealTypeShimmer } from '../components/skeleton';
import { updateCustomerProductInclusion } from '../features/customer/customerSlice';

type RootStackParamList = {
    Allergies: { outlineId: string };
    PreferredCuisine: undefined;
};

type AllergiesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Allergies'>;

interface AllergiesScreenProps {
    navigation: AllergiesScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Allergies'>;
}

const AllergiesScreen: React.FC<AllergiesScreenProps> = ({ navigation, route }) => {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [outlineId, setOutlineId] = useState<string>(route?.params?.outlineId);
    const [data, setData] = useState<any[]>([]);

    const dispatch = useDispatch();

    const { productOutline, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    useEffect(() => {
        const selectedOutline = productOutline?.find((outline: any) => outline.Id === outlineId);
        if (selectedOutline && selectedOutline?.ProductInclusion) {
            setData(selectedOutline?.ProductInclusion);
            console.log('data', data);
        }
    }, [outlineId, productOutline]);

    const handleSelectedType = (Id: string) => {
        if (selectedTypes.includes(Id)) {
            setSelectedTypes(selectedTypes.filter(type => type !== Id));
        } else {
            setSelectedTypes([...selectedTypes, Id]);
        }
    };

    const { customer } = useSelector(
        (state: RootState) => state.customer
    );

    useEffect(() => {
        console.log(customer)
    }, [customer]);

    const handleNext = async () => {
        let inclusionsToAdd = [];

        for (const selectedId of selectedTypes) {
            const matchedInclusion = data.find(inclusion => inclusion.Id === selectedId);

            if (matchedInclusion) {
                const inclusionData = {
                    inclusionName: matchedInclusion.Name,
                    inclusionDetail: matchedInclusion.Detail,
                    inclusionId: matchedInclusion.Id,
                };

                inclusionsToAdd.push(inclusionData);
            }
        }

        if (inclusionsToAdd.length > 0) {
            dispatch(updateCustomerProductInclusion(inclusionsToAdd));
            console.log("Inclusions added to Redux state");
        }

        navigation.navigate('PreferredCuisine');
    };

    return (
        <View
            style={{ backgroundColor: theme.colors.background.bgGrayPurple }}
        >
            <Stepper
                title={'WHAT DO YOU NOT EAT?'}
                instruction={"Your diet plan might have foods you don't eat. We will put a warning sign next to those meals. This way, you can easily change them for other meals you like."}
                step={2}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={() => handleNext()}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.darker}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={false}
            >
                {
                    loadingFranchise && (
                        <MealTypeShimmer />
                    )
                }
                <FlatList
                    contentContainerStyle={{
                        width: Display.setWidth(100),
                        marginTop: Display.setHeight(0.5),
                        alignItems: 'center',
                    }}
                    data={data}
                    keyExtractor={(item) => item.Id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.Id}
                            style={{
                                width: Display.setWidth(40),
                                height: Display.setWidth(35),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                backgroundColor: selectedTypes.includes(item.Id) ? theme.colors.accent.light : theme.colors.accent.mediumGray,
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
                                <Image
                                    source={{ uri: item?.Icon }}
                                    style={{
                                        width: Display.setWidth(20),
                                        resizeMode: 'contain',
                                        aspectRatio: 1,
                                        tintColor: theme.colors.custom[2].stromboli
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(2),
                                        marginTop: Display.setHeight(1),
                                        fontWeight: '400',
                                        color: theme.colors.primary.dark
                                    }}
                                >
                                    {item.Name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    numColumns={2}
                />
            </Stepper>
        </View>
    )
}

export default AllergiesScreen
