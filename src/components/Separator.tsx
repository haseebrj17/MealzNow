import { View } from 'react-native';
import React from 'react';
import { Display } from '../utils';
import { theme } from '../theme/theme';

type Props = {
    width?: number | `${number}%`,
    color?: string,
    height?: number | `${number}%`
}

function Separator({ width, color, height }: Props) {

    return (
        <View
            style={{
                width: width,
                height: height,
                backgroundColor: color
            }}
        />
    )
}

export default Separator;
