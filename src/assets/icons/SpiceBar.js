import React from "react";
import { Icon, Center } from "native-base";
import { Path, G, Circle, Rect } from "react-native-svg";
import { TouchableHighlight, TouchableOpacity } from "react-native";

const SpiceBar = ({ color, spiceColor, vSpiceColor, size, style }) => {
    return <Center style={style}>
        <Icon size={size} viewBox="0 0 150 40" >
            <Circle cx="20.5781" cy="20" r="20" fill="#D9D9D9"/>
            <Circle cx="129.578" cy="20" r="20" fill="#D9D9D9"/>
            <Circle cx="75.0781" cy="20" r="20" fill="#D9D9D9"/>
            <Rect x="37.453" y="12.5" width="20" height="15" fill="#D9D9D9"/>
            <Rect x="92.7032" y="12.5" width="20" height="15" fill="#D9D9D9"/>
            
        </Icon>
    </Center>;
};

export default SpiceBar;