import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

/**
 * Calculates a percentage of the total screen height.
 * @param h - The height percentage to calculate.
 * @returns The calculated height as a number.
 */
const setHeight = (h: number): number => {
    return (height / 100) * h;
};

/**
 * Calculates a percentage of the total screen width.
 * @param w - The width percentage to calculate.
 * @returns The calculated width as a number.
 */
const setWidth = (w: number): number => {
    return (width / 100) * w;
};

export default { setHeight, setWidth };
