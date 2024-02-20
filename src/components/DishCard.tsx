import React, { useRef, useState } from 'react'
import { View, TouchableOpacity, Animated, Platform, Image, Text } from 'react-native'
import { getOrderType } from '../shared/Enums'
import { Display, transformImageUrl, formatTimeToAMPMNonISO } from '../utils'
import { theme } from '../theme/theme'
import { MaterialIcons } from '@expo/vector-icons'
import { DishCardProps } from '../types/dishCard'

const DishCard: React.FC<DishCardProps> = ({ dish, today, customerOrderPayment }) => {

    const isAndroid = Platform.OS === 'android';
    const aspectRatio = 4265 / 1200
    let aspectRatioDish = 3024 / 2095;
    const Height = Display.setHeight(4)
    const Width = Height * aspectRatio

    const [expanded, setExpanded] = useState<boolean>(false);
    const [elevation, setElevation] = useState<number>(8);

    const animatedHeight = useRef(new Animated.Value(Display.setHeight(23))).current;
    const rotationAnim = useRef(new Animated.Value(0)).current; // Initial value 0 for unrotated state

    const toggleExpand = () => {
        const newHeight = expanded ? Display.setHeight(23) : Display.setHeight(40);
        const toValue = expanded ? 0 : 1;

        Animated.timing(animatedHeight, {
            toValue: newHeight,
            duration: 800,
            useNativeDriver: false,
        }).start();

        Animated.timing(rotationAnim, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setExpanded(!expanded);
    };

    const rotation = rotationAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <Animated.View
            style={{
                width: Display.setWidth(90),
                height: animatedHeight,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginTop: Display.setHeight(2),
                borderRadius: Display.setHeight(2),
                backgroundColor: theme.colors.accent.lighter,
                padding: theme.padding.medium,
                shadowColor: isAndroid ? undefined : theme.colors.primary.dark,
                shadowOffset: isAndroid ? undefined : { width: 0, height: 2 },
                shadowOpacity: isAndroid ? undefined : 0.35,
                shadowRadius: isAndroid ? undefined : 3.84,
                elevation: elevation,
            }}
        >
            <View
                style={{
                    width: Display.setWidth(30),
                    height: Display.setWidth(20),
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
            >
                <Image
                    style={{
                        width: Display.setWidth(35),
                        height: 'auto',
                        borderRadius: Display.setWidth(1.5),
                        aspectRatio: aspectRatioDish
                    }}
                    source={{ uri: transformImageUrl({ originalUrl: dish?.image ?? '', size: '/tr:w-200' }) }}
                />
                <View
                    style={{
                        width: Display.setWidth(90),
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text
                        style={{
                            marginTop: theme.padding.small,
                            fontSize: Display.setHeight(1.6),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC',
                            fontWeight: '600',
                        }}
                    >{dish?.name}</Text>
                    <Text
                        style={{
                            marginTop: theme.padding.small,
                            fontSize: Display.setHeight(1.3),
                            color: theme.colors.accent.textGray,
                            fontFamily: 'RC',
                            fontWeight: '400',
                        }}
                    ><Text
                        style={{
                            fontSize: Display.setHeight(1.3),
                            color: theme.colors.accent.textGray,
                            fontFamily: 'RC',
                            fontWeight: '500',
                        }}
                    >Ingredients:</Text> {dish?.ingredientSummary}</Text>
                </View>
            </View>
            <View
                style={{
                    width: Display.setWidth(44),
                    paddingLeft: theme.padding.small,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
            >
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <MaterialIcons
                        name={'schedule'}
                        size={Display.setHeight(2)}
                        color={theme.colors.custom[2].stromboli}
                    />
                    <Text
                        style={{
                            fontSize: Display.setHeight(1.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC',
                            fontWeight: '500',
                        }}
                    > {formatTimeToAMPMNonISO(dish?.deliveryTimings ?? '')}</Text>
                </View>
                <Text
                    style={{
                        marginTop: theme.padding.small,
                        fontSize: Display.setHeight(1.5),
                        color: theme.colors.primary.dark,
                        fontFamily: 'RC',
                        fontWeight: '500',
                    }}
                ><Text
                    style={{
                        fontSize: Display.setHeight(1.5),
                        color: theme.colors.custom[2].stromboli,
                        fontFamily: 'RC',
                        fontWeight: '600',
                    }}
                >Delivery Time:</Text> {dish?.estimatedDeliveryTime} min</Text>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginTop: theme.padding.small,
                    }}
                >
                    <MaterialIcons
                        name={'attach-money'}
                        size={Display.setHeight(2)}
                        color={theme.colors.custom[2].stromboli}
                    />
                    <Text
                        style={{
                            fontSize: Display.setHeight(1.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC',
                            fontWeight: '500',
                        }}
                    >{customerOrderPayment?.paymentType === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</Text>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginTop: theme.padding.small,
                    }}
                >
                    <MaterialIcons
                        name={'local-shipping'}
                        size={Display.setHeight(2)}
                        color={theme.colors.custom[2].stromboli}
                    />
                    <Text
                        style={{
                            fontSize: Display.setHeight(1.5),
                            color: theme.colors.primary.dark,
                            fontFamily: 'RC',
                            fontWeight: '500',
                        }}
                    > {getOrderType(customerOrderPayment)}</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={toggleExpand}
                style={{
                    width: Display.setWidth(90),
                    height: Display.setHeight(3),
                    position: 'absolute',
                    borderRadius: Display.setHeight(2),
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <MaterialIcons
                        name={'expand-more'}
                        size={Display.setHeight(3)}
                        color={theme.colors.accent.textGray}
                    />
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default DishCard