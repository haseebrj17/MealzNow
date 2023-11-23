import { Dimensions } from 'react-native';

const useDeviceHeight = () => {
    // Get device width, height, and aspect ratio
    const { width, height } = Dimensions.get('window');
    const aspectRatio = width / height;

    // Coefficients from polynomial regression for lowerHeight
    const lowerHeightCoeffs = {
        a: 0.7,
        b: 1.48918337e-12,
        c: 2.34190834e-09,
        d: -3.21412614e-15 + 3.40511527e-15 + 5.34434904e-12 - 8.96827525e-16 - 2.85267933e-12 - 2.21382921e-09 // Sum of the polynomial interaction terms
    };

    // Coefficients from polynomial regression for highHeight
    const highHeightCoeffs = {
        a: 1.05,
        b: 2.12479594e-13,
        c: 3.94701469e-10,
        d: -4.36720023e-16 + 4.46795657e-16 + 8.19692367e-13 - 1.12766315e-16 - 3.89029284e-13 - 3.84824073e-10 // Sum of the polynomial interaction terms
    };

    // Calculate lowerHeight and highHeight using coefficients and device properties
    const lowerHeight = lowerHeightCoeffs.a * width + lowerHeightCoeffs.b * height + lowerHeightCoeffs.c * aspectRatio + lowerHeightCoeffs.d;
    const highHeight = highHeightCoeffs.a * width + highHeightCoeffs.b * height + highHeightCoeffs.c * aspectRatio + highHeightCoeffs.d;

    return { lowerHeight, highHeight };
}

export default useDeviceHeight;
