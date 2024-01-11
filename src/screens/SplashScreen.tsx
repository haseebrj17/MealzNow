import React from "react";
import { View, Image, Text, Dimensions } from "react-native";
import { Splash } from "../assets/constants/Slider";
import { NativeBaseProvider } from "native-base";
import { useState } from "react";

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    return (
        <View
            style={{
                width,
                height,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff'
            }}
        >
            <Image source={require('../assets/SplashScreenGif.gif')}
                style={{
                    resizeMode: 'contain',
                    width: width * 0.8,
                }}
            />
        </View>
    )
}

export default SplashScreen;