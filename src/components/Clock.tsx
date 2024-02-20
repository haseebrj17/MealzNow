// Clock.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Display } from '../utils';
import { theme } from '../theme/theme';

interface ClockProps {
    time: string; // Can be in "HH:mm" or ISO format "YYYY-MM-DDTHH:MM:SS"
    size: number; // Size of the clock in pixels
}

const Clock: React.FC<ClockProps> = ({ time, size }) => {
    // ...Your existing logic to extract time and calculate angles

    const extractTime = (isoString: string) => {
        const date = new Date(isoString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    };

    // Check if the time is in ISO format and extract the HH:mm part
    const displayTime = time.includes('T') ? extractTime(time) : time;
    const [hours, minutes] = displayTime.split(':').map(Number);

    // Calculate angles
    const minuteAngle = (minutes / 60) * 360;
    const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

    // Dynamically calculate sizes and positions based on the `size` prop
    const clockFaceSize = size;
    const hourHandLength = size * 0.4; // Example: 40% of the clock's size
    const minuteHandLength = size * 0.5; // Example: 50% of the clock's size
    const handWidth = size * 0.02; // Example: 2% of the clock's size for minute hand, adjust as needed
    const hourHandWidth = size * 0.03; // Adjust based on design preference

    const dynamicStyles = StyleSheet.create({
        clockFace: {
            width: clockFaceSize,
            height: clockFaceSize,
            borderRadius: clockFaceSize / 2,
            borderWidth: size * 0.015, // Adjust the border width based on size
            borderColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
        },
        hourHand: {
            width: hourHandWidth,
            height: hourHandLength,
            shadowColor: theme.colors.custom[2].stromboli,
            shadowOffset: { width: 0.8, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
            borderRadius: Display.setWidth(0.5),
            transform: [{ translateY: -(hourHandLength / 2) }, { rotate: `${hourAngle}deg` }],
            bottom: hourHandLength / 4,
            left: (hourHandLength * 2 + hourHandWidth) / 2,
        },
        minuteHand: {
            width: handWidth,
            height: minuteHandLength,
            shadowColor: theme.colors.custom[2].stromboli,
            shadowOffset: { width: 0.8, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 3,
            borderRadius: Display.setWidth(0.4),
            transform: [{ translateY: -(minuteHandLength / 2) }, { rotate: `${minuteAngle}deg` }],
            bottom: 0,
            left: (minuteHandLength * 2 + handWidth) / 2,
        },
        centerPoint: {
            width: size * 0.05, // Example: 5% of the clock's size
            height: size * 0.05, // Keep it circular
            borderRadius: size * 0.025,
            backgroundColor: 'black',
            position: 'absolute',
        },
        // Define other dynamic styles as needed
    });

    return (
        <View style={dynamicStyles.clockFace}>
            <View style={dynamicStyles.hourHand} />
            <View style={dynamicStyles.minuteHand} />
            <View style={dynamicStyles.centerPoint} />
        </View>
    );
};

export default Clock;

// // Corrected styles for Clock.tsx
// const styles = StyleSheet.create({
//     clockFace: {
//         width: Display.setWidth(20),
//         height: Display.setWidth(20),
//         borderRadius: Display.setWidth(50),
//         borderWidth: Display.setWidth(0.3),
//         borderColor: 'black',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'white',
//     },
//     hand: {
//         position: 'absolute',
//         backgroundColor: 'black',
//     },
//     hourHand: {
//         width: Display.setWidth(1),
//         height: Display.setHeight(4),
//         shadowColor: theme.colors.custom[2].stromboli,
//         shadowOffset: { width: 0.8, height: 0 },
//         shadowOpacity: 0.5,
//         shadowRadius: 3,
//         bottom: Display.setHeight(1),
//         left: Display.setWidth(8 - 1 / 2),
//         borderRadius: Display.setWidth(0.5),
//         transform: [{ translateY: 25 }],
//     },
//     minuteHand: {
//         width: Display.setWidth(0.8),
//         height: Display.setHeight(5),
//         shadowColor: theme.colors.custom[2].stromboli,
//         shadowOffset: { width: 0.8, height: 0 },
//         shadowOpacity: 0.5,
//         shadowRadius: 3,
//         borderRadius: Display.setWidth(0.4),
//         bottom: Display.setWidth(-2),
//         left: Display.setWidth(10 - 0.8 / 2),
//         marginLeft: Display.setWidth(-0.3),
//         transform: [{ translateY: 37.5 }],
//     },
//     centerPoint: {
//         width: Display.setHeight(1),
//         height: Display.setHeight(1),
//         borderRadius: Display.setHeight(2),
//         backgroundColor: 'black',
//         position: 'absolute',
//     },
// });
