import Display from "../utils/Display";

export interface ThemeType {
    colors: {
        primary: {
            light: string;
            dark: string;
            darker: string;
        };
        accent: {
            lighter: string;
            lightest: string;
            medium: string;
            light: string;
            lightGray: string,
            mediumGray: string,
            gray: string
            darkGray: string,
            darkerGray: string,
            disabledGray: string,
            borderGray: string,
            textGray: string,
        };
        secondary: {
            lightGrayGreen: string,
            darkGray: string,
            black: string,
        };
        background: {
            bgGrayGreen: string,
            bgGrayPurple: string,
        },
        custom: {
            1: {
                summerGreen: string;
                lola: string;
                sanddune: string;
            };
            2: {
                stromboli: string;
                caper: string;
                perfume: string;
            };
            3: {
                saharasand: string;
                spicymix: string;
                anzac: string;
            };
            4: {
                crusta: string;
                snuff: string;
                casablanca: string;
            };
            5: {
                vanillaice: string;
                gumleaf: string;
                aquaforest: string;
            };
            6: {
                malibu: string;
                viridian: string;
                turquoiseblue: string;
            };
            7: {
                elm: string;
                caribbeangreen: string;
                fallgreen: string;
            };
            8: {
                reef: string;
                moonraker: string;
                tropicalrainforest: string;
            };
            9: {
                mindaro: string;
                lightorchid: string;
                chartreuseyellow: string;
            };
            10: {
                casal: string;
                eucalyptus: string;
                mischka: string;
            };
        };
        white: string,
    };
    padding: {
        small: number,
        medium: number,
        large: number
    };
}

export const theme: ThemeType = {
    colors: {
        primary: {
            light: '#68DA79', // Light green
            dark: '#152C18',  // Dark green
            darker: '#0C3426' // Darker green
        },
        accent: {
            lighter: '#EFFBF1',
            lightest: '#D2F4D7', // Very light green
            lightGray: '#F1F1F1', // Very light gray
            light: '#ACC8B0',    // Medium light green
            medium: '#F3FCF4',  // Off-white green tint
            mediumGray: '#D9D9D9', // Medium gray
            gray: '#b6b6b6', // gray
            darkGray: '#454545', // Dark gray
            darkerGray: '#393939', // Darker gray
            disabledGray: '#929292', // Disabled gray
            borderGray: '#8F9A90', // Border gray
            textGray: '#8c8c8c', // Text gray
        },
        secondary: {
            lightGrayGreen: '#8F9A90', // Gray with a hint of green
            darkGray: '#2B2B2B',  // Almost black
            black: '#000000',     // Black
        },
        background: {
            bgGrayGreen: '#EBEEEC', // Background gray green color for the app
            bgGrayPurple: '#F1EFF2' // Background pruple color for the app
        },
        custom: {
            1: {
                summerGreen: '#99b7a4',
                lola: '#dccfd3',
                sanddune: '#80645f',
            },
            2: {
                stromboli: '#30654e',
                caper: '#d4edb8',
                perfume: '#f3c6fb',
            },
            3: {
                saharasand: '#f1f38b',
                spicymix: '#764342',
                anzac: '#e1a340',
            },
            4: {
                crusta: '#fa7436',
                snuff: '#e4dfeb',
                casablanca: '#f2a848',
            },
            5: {
                vanillaice: '#f3d7d9',
                gumleaf: '#bdd5c8',
                aquaforest: '#5fa683',
            },
            6: {
                malibu: '#6f9ff8',
                viridian: '#418981',
                turquoiseblue: '#59e5ec',
            },
            7: {
                elm: '#207576',
                caribbeangreen: '#06d8a0',
                fallgreen: '#ecebb8',
            },
            8: {
                reef: '#d8ffb1',
                moonraker: '#d4cdf4',
                tropicalrainforest: '#007f55',
            },
            9: {
                mindaro: '#d4f68e',
                lightorchid: '#e49fcb',
                chartreuseyellow: '#ebf70b',
            },
            10: {
                casal: '#306365',
                eucalyptus: '#1e725f',
                mischka: '#dfd6e3'
            }
        },
        white: '#FFFFFF',       // White
    },
    padding: {
        small: Display.setHeight(1),
        medium: Display.setHeight(2),
        large: Display.setHeight(4)
    }
};