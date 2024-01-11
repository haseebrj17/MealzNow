import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Display } from '../utils';
import { theme } from '../theme/theme';
const { height } = Dimensions.get('screen')

interface InputProps {
    onChangeText: (text: string) => void;
    onFocus?: () => void;
    iconName?: string;
    label?: string;
    placeholder?: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad" | "decimal-pad" | "visible-password" | "ascii-capable" | "numbers-and-punctuation" | "url" | "name-phone-pad" | "twitter" | "web-search";
    password?: boolean | undefined;
    error?: string | undefined | null;
    value?: string | undefined | null;
}

const Input: React.FC<InputProps> = ({
    label,
    iconName,
    error,
    password,
    onFocus,
    onChangeText,
    placeholder,
    keyboardType,
    value,
    ...props
}) => {

    const [hidePassword, setHidePassword] = useState(password);
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={{ marginBottom: Display.setHeight(1) }}>
            <Text style={style.label}>{label}</Text>
            <View
                style={[
                    style.inputContainer,
                    {
                        borderColor: error
                            ? 'red'
                            : isFocused
                                ? '#325962'
                                : '#A6B5C',
                        alignItems: 'center',
                    },
                ]}>
                <Icon
                    name={iconName ? iconName : ''}
                    style={{ color: theme.colors.custom[2].stromboli, fontSize: Display.setHeight(2), marginRight: Display.setHeight(1) }}
                />
                <TextInput
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType || "default"}
                    autoCorrect={false}
                    onFocus={() => {
                        onFocus && onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={hidePassword}
                    style={{ color: "#325964", flex: 1 }}
                    {...props}
                />
                {password && (
                    <Icon
                        onPress={() => setHidePassword(!hidePassword)}
                        name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                        style={{ color: theme.colors.custom[2].stromboli, fontSize: Display.setHeight(2) }}
                    />
                )}
            </View>
            {error && (
                <Text style={{ marginTop: Display.setHeight(0.8), color: "red", fontSize: 12 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const style = StyleSheet.create({
    label: {
        marginVertical: Display.setHeight(0.5),
        fontSize: Display.setHeight(1.5),
        color: "grey",
    },
    inputContainer: {
        height: height * 0.06,
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        paddingHorizontal: Display.setHeight(1.5),
        borderWidth: Display.setHeight(0.06),
        borderRadius: Display.setHeight(1.2),
    },
});

export default Input;
