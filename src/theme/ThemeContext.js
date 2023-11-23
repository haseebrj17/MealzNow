import React, { createContext, useContext, useState } from 'react';
import { Theme } from './theme';

const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(Theme)
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useCustomTheme = () => useContext(ThemeContext);