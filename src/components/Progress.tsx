import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { theme, ThemeType } from '../theme/theme'

interface ProgressProps {
    step: number,
    steps: number,
    height: number
}

const Progress: React.FC<ProgressProps> = ({ step, steps, height }) => {
    const [width, setWidth] = useState(0);
    const animatedVaule = useRef(new Animated.Value(-1000)).current;
    const reactive = useRef(new Animated.Value(-1000)).current;

    useEffect(() => {
        Animated.timing(animatedVaule, {
            toValue: reactive,
            duration: 700,
            useNativeDriver: true
        }).start()
    }, [])

    useEffect(() => {
        reactive.setValue(-width + (width * step) / steps)
    }, [step, width])

    return (
        <View
            onLayout={e => {
                const newWidth = e.nativeEvent.layout.width
                setWidth(newWidth)
            }}
            style={{
                height,
                width: '90%',
                alignSelf: 'center',
                backgroundColor: theme.colors.secondary.lightGrayGreen,
                borderRadius: height,
                overflow: 'hidden',
            }}
        >
            <Animated.View
                style={{
                    height,
                    width: '100%',
                    borderRadius: height,
                    backgroundColor: theme.colors.primary.dark,
                    position: 'absolute',
                    left: '0%',
                    top: '0%',
                    transform: [
                        {
                            translateX: animatedVaule
                        }
                    ]
                }}
            />
        </View>
    )
}

export default Progress