import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import PropTypes from 'prop-types';

interface SkeletonProps {
    width: number;
    height: number;
    style?: object | object[];
    backgroundColor?: string;
    children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, style, backgroundColor }) => {
    const translateX = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(translateX, {
                toValue: width,
                useNativeDriver: true,
                duration: 1000,
            })
        );

        animation.start();

        return () => animation.stop();
    }, [width])

    return (
        <View
            style={
                StyleSheet.flatten([
                    { width: width, height: height, backgroundColor: backgroundColor ? backgroundColor : "rgba(0, 0, 0, 0.12)", overflow: 'hidden' },
                    style
                ])
            }
        >
            <Animated.View style={{
                width: '100%', height: '100%', transform: [{
                    translateX: translateX
                }]
            }} >
                <LinearGradient
                    style={{
                        width: '100%', height: '100%'
                    }}
                    colors={["transparent", "rgba(0, 0, 0, 0.05)", "transparent"]}
                    start={{ x: 1, y: 1 }}
                />
            </Animated.View>
        </View>
    )
}

export default Skeleton

Skeleton.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    backgroundColor: PropTypes.string
};