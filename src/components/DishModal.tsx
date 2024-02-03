import { theme } from "../theme/theme"
import React from "react"
import { View, TouchableOpacity, Text, Image } from "react-native"
import { Modal, NativeBaseProvider } from "native-base"
import { Display, transformImageUrl } from "../utils"
import Separator from "./Separator"
import { MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons"


interface ProductAllergy {
    AllergyName: string;
}

interface ProductPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductCategory {
    CategoryId: string;
    CategoryName: string;
    CategoryType: string;
}

interface ProductExtraDipping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraDippingAllergy: ProductExtraDippingAllergy[] | null;
    ProductExtraDippingPrice: ProductExtraDippingPrice[] | null;
}

interface ProductExtraDippingAllergy {
    AllergyName: string;
}

interface ProductExtraDippingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductExtraTopping {
    Id: string;
    Name: string;
    Detail: string;
    ProductExtraToppingAllergy: ProductExtraToppingAllergy[] | null;
    ProductExtraToppingPrice: ProductExtraToppingPrice[] | null;
}

interface ProductExtraToppingAllergy {
    AllergyName: string;
}

interface ProductExtraToppingPrice {
    Id: string;
    Price: number;
    Name: string;
    Description: string;
}

interface ProductItemOutline {
    Id: string;
    Name: string;
}

interface ProductChoices {
    Name: string;
    Detail: string;
}

interface Dish {
    Id: string;
    Name: string;
    Detail: string;
    EstimatedDeliveryTime: number,
    Sequence: number;
    SpiceLevel: number;
    Type: string;
    IngredientSummary: string;
    IngredientDetail: string;
    Image: string;
    IsActive: boolean;
    ShowExtraTopping: boolean;
    ShowExtraDipping: boolean;
    ProductAllergy: ProductAllergy[] | null;
    ProductPrice: ProductPrice[];
    ProductCategory: ProductCategory[];
    CategoryId: string;
    ProductExtraDipping: ProductExtraDipping[] | null;
    ProductExtraTopping: ProductExtraTopping[] | null;
    ProductItemOutline: ProductItemOutline[] | null;
    ProductChoices: ProductChoices[] | null;
}


interface MealPlan {
    date: string;
    meals: MealsForTheDay;
}

interface MealsForTheDay {
    [key: string]: MealDetails | undefined;
    Lunch?: MealDetails;
    Dinner?: MealDetails;
}

interface MealDetails {
    dish: Dish;
    perks: Perks;
}

interface Perks {
    IncludesDrinks: boolean;
    IncludesSides: boolean;
    IncludesDessert: boolean;
    IncludesToppings?: boolean;
    IncludesDippings?: boolean;
}

interface Props {
    popoverVisible: boolean;
    setPopoverVisible: React.Dispatch<React.SetStateAction<boolean>>;
    item: MealPlan;
    timing: string
    initialRef: React.RefObject<any>;
}

const aspectRatio = 3024 / 2095;

const DishModal: React.FC<Props> = ({ popoverVisible, setPopoverVisible, item, timing, initialRef }) => {

    const url = item?.meals?.[timing]

    return (
        <NativeBaseProvider>
            <Modal
                isOpen={popoverVisible}
                onClose={() => setPopoverVisible(false)}
                initialFocusRef={initialRef}
                style={{
                    backgroundColor: theme.colors.accent.lightGray,
                    borderRadius: Display.setWidth(3),
                    position: 'absolute',
                    width: Display.setWidth(80),
                    height: Display.setHeight(70),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        width: Display.setWidth(80),
                        height: Display.setHeight(7),
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        padding: theme.padding.medium,
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2.5),
                            fontWeight: '500',
                            fontFamily: 'RC',
                            color: theme.colors.custom[2].stromboli,
                        }}
                    >{url?.dish.Name}</Text>
                    <TouchableOpacity
                        style={{
                            width: Display.setWidth(5),
                            height: Display.setWidth(5),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => setPopoverVisible(false)}
                    >
                        <Entypo name="cross" size={Display.setHeight(2.5)} color={theme.colors.custom[2].stromboli} />
                    </TouchableOpacity>
                </View>
                <Separator width={Display.setWidth(80)} color={theme.colors.accent.mediumGray} height={Display.setHeight(0.2)} />
                <View
                    style={{
                        width: Display.setWidth(80),
                        height: Display.setHeight(63),
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        padding: theme.padding.medium,
                    }}
                >
                    <Image
                        // source={{ uri: item.meals.Lunch?.dish.Image }}
                        source={{ uri: transformImageUrl({ originalUrl: url?.dish?.Image ? url?.dish.Image : '', size: '/tr:w-400' }) }}
                        style={{
                            width: Display.setWidth(50),
                            borderRadius: Display.setWidth(3),
                            height: 'auto',
                            aspectRatio: aspectRatio,
                            resizeMode: 'contain',
                        }}
                    />
                    <View
                        style={{
                            width: Display.setWidth(60),
                            height: Display.setHeight(13),
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: Display.setHeight(1),
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.6),
                                    fontWeight: '600',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.darkGray,
                                }}
                            >Details</Text>
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.4),
                                    fontWeight: '500',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.textGray,
                                    marginTop: Display.setHeight(0.5),
                                }}
                            >{url?.dish.Detail}</Text>
                        </View>
                        {url?.dish.ProductAllergy?.length != 0 &&
                            <View
                                style={{
                                    marginTop: Display.setHeight(1),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.6),
                                        fontWeight: '600',
                                        fontFamily: 'RC',
                                        color: theme.colors.accent.darkGray,
                                    }}
                                >Allergien</Text>
                                {url?.dish.ProductAllergy?.map((allergy, index) => {
                                    return (
                                        <Text
                                            key={index}
                                            style={{
                                                fontSize: Display.setHeight(1.4),
                                                fontWeight: '500',
                                                fontFamily: 'RC',
                                                color: theme.colors.accent.textGray,
                                                marginTop: Display.setHeight(0.5),
                                            }}
                                        >{allergy.AllergyName}</Text>
                                    )
                                })}
                            </View>
                        }
                        <View
                            style={{
                                marginTop: Display.setHeight(1),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.6),
                                    fontWeight: '600',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.darkGray,
                                }}
                            >Ingregients</Text>
                            <Text
                                style={{
                                    fontSize: Display.setHeight(1.4),
                                    fontWeight: '500',
                                    fontFamily: 'RC',
                                    color: theme.colors.accent.textGray,
                                    marginTop: Display.setHeight(0.5),
                                }}
                            >{url?.dish.IngredientSummary}</Text>
                        </View>
                        {url?.dish.ProductPrice?.length != 0 &&
                            <View
                                style={{
                                    marginTop: Display.setHeight(1),
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.6),
                                        fontWeight: '600',
                                        fontFamily: 'RC',
                                        color: theme.colors.accent.darkGray,
                                    }}
                                >Price</Text>
                                {url?.dish.ProductPrice?.map((price, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                width: Display.setWidth(16),
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: Display.setHeight(1.5),
                                                    fontWeight: '500',
                                                    fontFamily: 'RC',
                                                    color: theme.colors.accent.textGray,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                            >{price.Name}:</Text>
                                            <Text
                                                style={{
                                                    fontSize: Display.setHeight(1.4),
                                                    fontWeight: '500',
                                                    fontFamily: 'RC',
                                                    color: theme.colors.accent.textGray,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                            >{price.Price}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        </NativeBaseProvider>
    )
}

export default DishModal;