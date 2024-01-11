import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { theme } from '../theme/theme';

const LoadingOverlay = () => {
    return (
        <View style={styles.overlay}>
            <ActivityIndicator animating={true} size="small" color={theme.colors.primary.darkblue} />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)', // white with 40% opacity
        justifyContent: 'center', // center vertically
        alignItems: 'center', // center horizontally
        zIndex: 1000 // ensure the overlay is on top of other components
    }
});

export default LoadingOverlay;
