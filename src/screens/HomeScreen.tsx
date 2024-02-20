import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack';
import { ThemeType, theme } from '../theme/theme';
import { Display, fDateCustom, formatTimeToAMPMNonISO, transformImageUrl } from '../utils';
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Store';
import { fetchUserOrder } from '../features/user/userSlice';
import { Styles } from '../types/common';
import MN from '../assets/MN_LOGO_LG_NBG.png';
import { ProductByDay, ProductByTiming } from '../types/cart';
import { Clock, DishCard, Separator } from '../components';
import { getOrderType } from '../shared/Enums';

const { width, height } = Dimensions.get('window')

type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
}

type HomeScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProps;
    route: RootStackParamList;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {

    const styles = getStyles(theme);

    const isAndroid = Platform.OS === 'android';
    const aspectRatio = 4265 / 1200
    let aspectRatioDish = 3024 / 2095;
    const Height = Display.setHeight(4)
    const Width = Height * aspectRatio

    const dispatch = useDispatch<AppDispatch>();

    const { token } = useSelector((state: RootState) => state.general);

    const { order } = useSelector((state: RootState) => state.user);

    const [today, setToday] = React.useState<ProductByDay>();
    const [lunch, setLunch] = React.useState<ProductByTiming>();
    const [dinner, setDinner] = React.useState<ProductByTiming>();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [elevation, setElevation] = useState<number>(8);

    useEffect(() => {
        if (token) {
            dispatch(fetchUserOrder(token));
        }
    }, [dispatch, token]);

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

    useEffect(() => {
        if (order) {
            const date = new Date().toISOString().split('T')[0] + 'T00:00:00';
            console.log('Date:', date)
            const day = order?.productByDay?.find((day) => day.deliveryDate === date);
            if (day) {
                setToday(day);
                setLunch(day?.productByTiming?.find((timing) => timing.timeOfDay === 'Lunch'));
                setDinner(day?.productByTiming?.find((timing) => timing.timeOfDay === 'Dinner'));
            }
        }
    }, [order]);

    return (
        <View
            style={{
                width: Display.setWidth(100),
                height: Display.setHeight(100),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                flex: 1,
                backgroundColor: theme.colors.background.bgGrayPurple
            }}
        >
            <View style={styles.AppBar}>
                <Image
                    style={{
                        height: Height,
                        width: Width,
                        position: 'absolute',
                        left: (width / 2) - (Width / 2),
                        bottom: '7%'
                    }}
                    source={MN}
                />
                {
                    token.length > 0 ? (
                        <TouchableOpacity
                            style={{
                                width: Display.setHeight(4),
                                height: Display.setHeight(4),
                                borderRadius: Display.setHeight(2),
                                backgroundColor: theme.colors.primary.light,
                                shadowColor: theme.colors.primary.dark,
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.35,
                                shadowRadius: 1,
                                elevation: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                right: theme.padding.medium,
                                bottom: '0%',
                                margin: theme.padding.small,
                            }}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <FontAwesome5 name="user-alt" size={Display.setHeight(2)} color={theme.colors.custom[2].stromboli} />
                        </TouchableOpacity>
                    ) : (
                        <></>
                    )
                }
            </View>
            <ScrollView
                style={{
                    width: '100%',
                    height: Display.setHeight(100),
                    padding: theme.padding.medium,
                    backgroundColor: theme.colors.accent.lightGray,
                }}
                contentContainerStyle={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: Display.setHeight(3.5),
                        fontFamily: 'RC',
                        fontWeight: '700',
                        alignSelf: 'flex-start',
                        marginTop: Display.setHeight(2),
                        color: theme.colors.primary.darker,
                    }}
                >
                    Today's Menu
                </Text>
                <Text
                    style={{
                        fontSize: Display.setHeight(2.2),
                        fontFamily: 'RC',
                        fontWeight: '400',
                        alignSelf: 'flex-start',
                        marginTop: Display.setHeight(1),
                        color: theme.colors.primary.darker,
                    }}
                >
                    {fDateCustom(today?.deliveryDate ?? '')}
                </Text>
                <Separator
                    width={Display.setWidth(90)}
                    height={Display.setHeight(0.1)}
                    color={theme.colors.accent.mediumGray}
                />
                {today?.productByTiming?.find((timing) => timing.timeOfDay === 'Lunch') && (
                    <>
                        <Text
                            style={{
                                fontSize: Display.setHeight(2.5),
                                color: theme.colors.primary.dark,
                                fontFamily: 'RC',
                                alignSelf: 'flex-start',
                                marginTop: Display.setHeight(2),
                            }}
                        >
                            Lunch
                        </Text>
                        <DishCard
                            dish={today?.productByTiming?.find((timing) => timing.timeOfDay === 'Lunch')}
                            today={today}
                            customerOrderPayment={order?.customerOrderPayment}
                        />
                    </>
                )}
                {today?.productByTiming?.find((timing) => timing.timeOfDay === 'Dinner') && (
                    <>
                        <Text
                            style={{
                                fontSize: Display.setHeight(2.5),
                                color: theme.colors.primary.dark,
                                fontFamily: 'RC',
                                alignSelf: 'flex-start',
                                marginTop: Display.setHeight(2),
                            }}
                        >
                            Dinner
                        </Text>
                        <DishCard
                            dish={today?.productByTiming?.find((timing) => timing.timeOfDay === 'Dinner')}
                            today={today}
                            customerOrderPayment={order?.customerOrderPayment}
                        />
                    </>
                )}
                <View
                    style={{
                        width: Display.setWidth(90),
                        marginTop: Display.setHeight(10),
                    }}
                />
            </ScrollView>
        </View >
    )
}

const getStyles = (theme: ThemeType): StyleSheet.NamedStyles<Styles> => StyleSheet.create({
    shadow: {
        shadowColor: theme.colors.primary.dark,
        shadowOffset: {
            width: 2,
            height: 10,
        },
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 6,
    },
    AppBar: {
        backgroundColor: theme.colors.primary.dark,
        height: Display.setHeight(12),
        width: width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingLeft: theme.padding.medium,
        paddingRight: theme.padding.medium
    }
});

export default HomeScreen