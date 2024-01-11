import React, { useState } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Easing } from 'react-native';

const containerStyle = (size: number, isActive: boolean) => ({
    backgroundColor: isActive ? '#325964' : '#d4d4d4',
    height: 32 * size,
    width: 64 * size,
    borderRadius: 32,
    padding: 4 * size,
});

const toggleStyle = (size: number, animatedValue: Animated.Value) => {
    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 32 * size],
    });

    return {
        height: 24 * size,
        width: 24 * size,
        backgroundColor: '#fff',
        borderRadius: 32,
        transform: [{ translateX }],
    };
};


const ToggleButton = ({ size, onToggle }: { size: number, onToggle: (newState: boolean) => void }) => {
    const [isActive, setIsActive] = useState(false);
    const [animatedValue, setAnimatedValue] = useState<Animated.Value>(new Animated.Value(0));

    // const toggleHandle = () => {
    //     Animated.timing(animatedValue, {
    //         toValue: isActive ? 0 : 32 * size,
    //         duration: 250,
    //         easing: Easing.bounce,
    //         delay: 0,
    //         useNativeDriver: true,
    //     }).start();
    //     setIsActive(!isActive);
    //     onToggle && onToggle(!isActive);
    // };

    const toggleHandle = () => {
        Animated.timing(animatedValue, {
            toValue: isActive ? 0 : 1, // animate from 0 to 1
            duration: 250,
            easing: Easing.bounce,
            delay: 0,
            useNativeDriver: true,
        }).start();
        setIsActive(!isActive);
        onToggle && onToggle(!isActive);
    };

    return (
        <TouchableOpacity
            style={containerStyle(size, isActive)}
            onPress={() => toggleHandle()}
            activeOpacity={0.8}>
            <Animated.View style={toggleStyle(size, animatedValue)} />
        </TouchableOpacity>
    );
};

export default ToggleButton;