import React, { useState } from 'react';
import { TouchableOpacity, Text, GestureResponderEvent, StyleSheet } from 'react-native';
import { theme, ThemeType } from '../theme/theme';
import { useFonts } from '../hooks/useFonts';
import AppLoading from 'expo-app-loading';

type Dimension = number | `${number}%`;

interface ButtonProps {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    color?: string;
    textColor?: string;
    disabled?: boolean;
    width?: Dimension;
    height?: Dimension;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress = () => { },
    color,
    textColor,
    disabled = false,
    width = '100%',
    height = 50,
}) => {

    const getButtonBackgroundColor = () => {
        return disabled ? theme.colors.accent.disabledGray : (color ?? theme.colors.primary.dark);
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled}
            style={[
                styles.button,
                {
                    backgroundColor: getButtonBackgroundColor(),
                    width,
                    height,
                }
            ]}
        >
            <Text style={[styles.text, { color: textColor ?? theme.colors.white }]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: '600',
        fontSize: 18,
        letterSpacing: 1,
    },
});

export default Button;