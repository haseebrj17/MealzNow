import React from 'react';
import { StyleSheet, ViewStyle, ImageStyle, Text, View, Image, Dimensions, GestureResponderEvent } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { theme, ThemeType } from '../theme/theme'; // Adjust the path as necessary
import { Appbar } from 'react-native-paper';
import Display from '../utils/Display';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import MN from '../assets/MN_LOGO_LG_NBG.png';
import Progress from './Progress';
import { useFonts } from '../hooks/useFonts';
import Button from './Button';

const { width, height } = Dimensions.get('window')

type Dimension = number | `${number}%`;

interface StepperProps {
    children: React.ReactNode;
    instruction: string;
    title: string;
    step?: number;
    steps?: number;
    height?: number;
    buttonWidth?: Dimension;
    buttonHeight?: Dimension;
    onPress?: (event: GestureResponderEvent) => void;
    buttonTitle?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    buttonDisabled?: boolean;
}

interface Styles {
    shadow: ViewStyle;
    AppBar: ViewStyle;
}

const Stepper: React.FC<StepperProps> = ({
    children,
    instruction,
    title,
    step,
    steps,
    height,
    buttonWidth,
    buttonHeight,
    onPress,
    buttonTitle,
    buttonColor,
    buttonTextColor,
    buttonDisabled,
}) => {

    const styles = getStyles(theme);

    const aspectRatio = 4265 / 1200
    const Height = Display.setHeight(4)
    const Width = Height * aspectRatio

    return (
        <View
            style={{
                width: '100%',
                height: '100%'
            }}
        >
            <Appbar style={styles.AppBar}>
                <TouchableOpacity
                    style={{
                        width: Display.setHeight(4),
                        height: Display.setHeight(4),
                        borderRadius: Display.setHeight(2),
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: '7%'
                    }}
                >
                    <AntDesign name="arrowleft" size={Display.setHeight(3)} color={theme.colors.primary.light} />
                </TouchableOpacity>
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
            </Appbar>
            <SafeAreaView
                style={{
                    paddingLeft: theme.padding.medium,
                    paddingRight: theme.padding.medium,
                    width: '100%',
                    height: Display.setHeight(100 - 28),
                    justifyContent: 'flex-start'
                }}
            >
                <Progress step={step || 1} steps={steps || 10} height={height || Display.setHeight(1)} />
                <Text
                    style={{
                        fontSize: Display.setHeight(3.5),
                        fontFamily: 'RC',
                        fontWeight: '700',
                        marginTop: Display.setHeight(2),
                        color: theme.colors.primary.darker,
                        paddingLeft: theme.padding.medium,
                        paddingRight: theme.padding.medium
                    }}
                >
                    {title ? title : ''}
                </Text>
                <View
                    style={{
                        marginTop: Display.setHeight(2),
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                    }}
                >
                    {children}
                </View>
            </SafeAreaView>
            <View
                style={{
                    width: '100%',
                    height: Display.setHeight(18),
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: '0%',
                    backgroundColor: theme.colors.accent.lightGray,
                    borderTopLeftRadius: Display.setHeight(1.5),
                    borderTopRightRadius: Display.setHeight(1.5),
                    shadowColor: theme.colors.primary.dark,
                    shadowOffset: {
                        width: 4,
                        height: -4,
                    },
                    shadowOpacity: 0.35,
                    shadowRadius: 5.5,
                    elevation: 9,
                }}
            >
                <View
                    style={{
                        width: '100%',
                        height: '40%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(1.3),
                            fontFamily: 'RC',
                            fontWeight: '500',
                            color: theme.colors.primary.dark,
                            paddingLeft: theme.padding.medium,
                            paddingRight: theme.padding.medium
                        }}
                    >
                        {instruction ? instruction : ''}
                    </Text>
                </View>
                <Button
                    width={buttonWidth}
                    height={buttonHeight}
                    onPress={onPress}
                    title={buttonTitle || 'NEXT'}
                    color={buttonColor}
                    textColor={buttonTextColor}
                    disabled={buttonDisabled}
                />
            </View>
        </View>
    )
}

export default Stepper

const getStyles = (theme: ThemeType): StyleSheet.NamedStyles<Styles> => StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: theme.colors.accent.medium,
    //     padding: 20,
    // },
    // header: {
    //     fontSize: 20,
    //     color: theme.colors.primary.dark,
    //     marginBottom: 10,
    // },
    // button: {
    //     backgroundColor: theme.colors.primary.light,
    //     padding: 15,
    //     borderRadius: 5,
    // },
    // buttonText: {
    //     color: theme.colors.white,
    //     textAlign: 'center',
    // },
    // secondaryText: {
    //     color: theme.colors.secondary.darkGray,
    // },
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
        height: Display.setHeight(10),
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingLeft: theme.padding.medium,
        paddingRight: theme.padding.medium
    }
});
