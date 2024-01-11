import { theme } from "../theme/theme";
import React from "react";
import { Text, View } from "react-native";

type Props = {
    message: string
}

const Tooltip: React.FC<Props> = ({ message }) => {
    return (
        <View style={{
            position: 'absolute',
            backgroundColor: theme.colors.accent.lightest,
            padding: 8,
            borderRadius: 5,
            shadowColor: theme.colors.accent.medium,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        }}>
            <Text style={{ color: 'black' }}>{message}</Text>
        </View>
    );
};

export default Tooltip;