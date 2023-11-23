// hooks/useFonts.ts
import * as Font from 'expo-font';

export const useFonts = async () => {
    await Font.loadAsync({
        'RCI': require('../assets/fonts/RobotoCondensed-Italic-VariableFont_wght.ttf'),
        'RC': require('../assets/fonts/RobotoCondensed-VariableFont_wght.ttf'),
    });
};
