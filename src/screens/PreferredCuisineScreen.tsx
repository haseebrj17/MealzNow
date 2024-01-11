import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { Children, useEffect, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'; // or NavigationProp from '@react-navigation/native'
import { Stepper } from '../components'
import { theme } from '../theme/theme';
import { useFonts } from '../hooks/useFonts';
import { Display, getImageAspectRatio } from '../utils';
import Vegetarian from '../assets/icons/Vegetarian';
import Omnivore from '../assets/icons/Omnivore';
import { useDispatch, useSelector } from 'react-redux';
import { setFlashMessage } from '../features/flashMessages/flashMessageSlice';
import FlashMessage from '../components/flashMessage';
import { AppDispatch, RootState } from '../Store';
import { fetchDashboardData } from '../features/restaurants/dashboardDataSlice';
import { insertPreferredCategory } from '../db/methods/custmerNestedOperations';

type RootStackParamList = {
    PreferredCuisine: undefined;
    PreferredCategories: undefined;
};

type PreferredCuisineScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PreferredCuisine'>;

interface PreferredCuisineScreenProps {
    navigation: PreferredCuisineScreenNavigationProp;
}

interface AspectRatioMap {
    [key: string]: number;
}

const PreferredCuisineScreen: React.FC<PreferredCuisineScreenProps> = ({ navigation }) => {

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [aspectRatios, setAspectRatios] = useState<AspectRatioMap>({});

    const handleSelectedType = (Id: string) => {
        if (selectedTypes.includes(Id)) {
            setSelectedTypes(selectedTypes.filter(type => type !== Id));
        } else {
            setSelectedTypes([...selectedTypes, Id]);
        }
    };

    const dispatch = useDispatch<AppDispatch>();

    const { franchiseDetails, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    const { brands, loadingDashboard } = useSelector(
        (state: RootState) => state.dashboard
    );

    useEffect(() => {
        if (franchiseDetails?.Id) {
            dispatch(fetchDashboardData({ FranchiseId: franchiseDetails.Id }));
        }
    }, [dispatch, franchiseDetails?.Id]);

    useEffect(() => {
        console.log('categories', brands);
        setCategoriesData(brands)
    }, [brands]);

    const handleNext = async () => {
        for (const selectedId of selectedTypes) {
            const matchedCategories = categoriesData.find(category => category.Id === selectedId);

            if (matchedCategories) {
                const categoryData = {
                    categoryId: matchedCategories.Id,
                    categoryName: matchedCategories.Name,
                };

                try {
                    const response = await insertPreferredCategory(categoryData);
                    console.log(`Inserted: ${response}`);
                } catch (error) {
                    console.error(`Error inserting inclusion: ${matchedCategories.Id}`, error);
                }
            }
        }
        navigation.navigate('PreferredCategories');
    }

    const updateAspectRatios = async (items: any[]) => {
        const ratios: AspectRatioMap = {};
        for (const item of items) {
            if (!item.Logo) {
                console.error(`Icon URI is null for item with Id ${item.Id}`);
                ratios[item.Id] = 1; // default ratio for items without a valid URI
                continue;
            }

            try {
                console.log(`Getting aspect ratio for ${item.Logo}`);
                const ratio = await getImageAspectRatio(item.Logo);
                ratios[item.Id] = ratio;
            } catch (error) {
                console.error(error);
                ratios[item.Id] = 1; // default ratio in case of an error
            }
        }
        setAspectRatios(ratios);
    };

    useEffect(() => {
        if (brands) {
            updateAspectRatios(brands);
        }
    }, [brands]);

    return (
        <View
            style={{ backgroundColor: theme.colors.background.bgGrayPurple }}
        >
            <Stepper
                title={'WHAT KIND OF FOOD DO YOU LIKE?'}
                step={3}
                steps={8}
                height={Display.setHeight(1)}
                buttonWidth={Display.setWidth(90)}
                buttonHeight={Display.setHeight(5)}
                onPress={() => handleNext()}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.dark}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={false}
                details={"You can choose between multiple Restaurants/Cuisines."}
            >
                <FlatList
                    contentContainerStyle={{
                        width: Display.setWidth(100),
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                    data={categoriesData ? categoriesData : []}
                    keyExtractor={(item) => item?.Id?.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            key={item.Id}
                            style={{
                                width: Display.setWidth(90),
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection: 'row',
                                height: Display.setHeight(15),
                                backgroundColor: selectedTypes.includes(item?.Id) ? theme.colors.accent.light : theme.colors.accent.mediumGray,
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
                                    source={{ uri: item?.Logo }}
                                    style={{
                                        width: Display.setHeight(8),
                                        resizeMode: 'contain',
                                        aspectRatio: aspectRatios[item.Id] || 1,
                                    }}
                                />
                            </View>
                            <View
                                style={{
                                    width: (Display.setWidth(90) - Display.setHeight(12)),
                                    height: '80%',
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
                                    {item?.Name}
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
                        </TouchableOpacity>
                    )
                    }
                />
            </Stepper>
        </View>
    )
}

export default PreferredCuisineScreen
