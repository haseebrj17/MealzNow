import { View, Text, TouchableOpacity, Image } from 'react-native'
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
import { clientData } from '../shared/ClientData';
import { fetchFranchiseData } from '../features/franchise/franchiseSlice';
import { AppDispatch, RootState } from '../Store';
import { MealTypeShimmer } from '../components/skeleton';
import { insertOrUpdateCustomerProductOutline } from '../db/methods/custmerNestedOperations';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Fonts from '../assets/fonts/Fonts';

const config = require('../../package.json').projectName;
const CLIENT_NAME = config.name;

interface AspectRatioMap {
    [key: string]: number;
}

type RootStackParamList = {
    MealType: undefined;
    Allergies: { outlineId: string | null };
    PreferredCuisine: undefined;
};

type MealTypeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MealType'>;

interface MealTypeScreenProps {
    navigation: MealTypeScreenNavigationProp;
}

const MealTypeScreen: React.FC<MealTypeScreenProps> = ({ navigation }) => {

    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [disabled, setDisabled] = useState(true);
    const [aspectRatios, setAspectRatios] = useState<AspectRatioMap>({});

    const Client = clientData.find((client) => client.name === CLIENT_NAME);
    const clientId = Client?.clientId;

    const dispatch = useDispatch<AppDispatch>();
    const { productOutline, loadingFranchise } = useSelector(
        (state: RootState) => state.franchise
    );

    useEffect(() => {
        function loadFonts() {
            Font.loadAsync(Fonts);
            setFontsLoaded(true);
        }
        loadFonts();
    }, []);

    useEffect(() => {
        if (clientId) {
            dispatch(fetchFranchiseData(clientId));
        }
    }, [dispatch, clientId]);

    const handleSelectedType = (Id: string) => {
        setSelectedType(Id);
        setDisabled(false);
    };

    // if (!fontsLoaded) {
    //     return <AppLoading />;
    // }

    const insertData = async () => {
        const outline = productOutline.find((item: any) => item?.Id === selectedType);
        if (!outline) {
            console.error("Outline not found");
            return;
        }

        const outlineData = {
            outlineId: outline.Id,
            title: outline.Title,
            description: outline.Description,
            icon: outline.Icon
        };

        try {
            const res = await insertOrUpdateCustomerProductOutline(outlineData);
            console.log(res);
            if (res) {
                if (outlineData.title === 'Vegetarian') {
                    navigation.navigate('PreferredCuisine');
                } else {
                    navigation.navigate('Allergies', { outlineId: selectedType });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };


    const updateAspectRatios = async (items: any[]) => {
        const ratios: AspectRatioMap = {};
        for (const item of items) {
            if (!item.Icon) {
                console.error(`Icon URI is null for item with Id ${item.Id}`);
                ratios[item.Id] = 1; // default ratio for items without a valid URI
                continue;
            }

            try {
                console.log(`Getting aspect ratio for ${item.Icon}`);
                const ratio = await getImageAspectRatio(item.Icon);
                ratios[item.Id] = ratio;
            } catch (error) {
                console.error(error);
                ratios[item.Id] = 1; // default ratio in case of an error
            }
        }
        setAspectRatios(ratios);
    };

    useEffect(() => {
        if (productOutline) {
            updateAspectRatios(productOutline);
        }
    }, [productOutline]);

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
                onPress={() => insertData()}
                buttonTitle="NEXT"
                buttonColor={theme.colors.primary.darker}
                buttonTextColor={theme.colors.custom[4].snuff}
                buttonDisabled={disabled}
            >
                {
                    loadingFranchise && (
                        <MealTypeShimmer />
                    )
                }
                {productOutline?.map((item: any) => {
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
                                        aspectRatio: aspectRatios[item.Id] || 1,
                                        tintColor: theme.colors.custom[2].stromboli
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
                                        // fontFamily: 'RC',
                                        fontWeight: '600',
                                        color: theme.colors.primary.dark
                                    }}
                                >
                                    {item?.Title}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.5),
                                        // fontFamily: 'RC',
                                        fontWeight: '600',
                                        color: theme.colors.accent.darkGray
                                    }}
                                >
                                    {item?.Description}
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