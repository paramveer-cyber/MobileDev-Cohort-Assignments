import { createContext, useContext, useState, ReactNode } from 'react';

const LIGHT = {
    bg: '#F5F5F0',
    surface: '#F0F0EB',
    card: '#FFFFFF',
    border: '#E8E8E3',
    accent: '#B91C1C',
    accentSoft: '#B91C1C12',
    text: '#1A1A1A',
    textSub: '#555555',
    textMuted: '#999999',
    tabBar: '#FFFFFF',
    headerBg: '#F5F5F0',
    inputBg: '#FFFFFF',
    inputBorder: '#D0C8C0',
    isDark: false,
};

const DARK = {
    bg: '#0F0F0D',
    surface: '#181816',
    card: '#1F1F1C',
    border: '#2C2C28',
    accent: '#DC2626',
    accentSoft: '#DC262618',
    text: '#F0EFE8',
    textSub: '#9A9990',
    textMuted: '#5A5A54',
    tabBar: '#181816',
    headerBg: '#0F0F0D',
    inputBg: '#1F1F1C',
    inputBorder: '#363630',
    isDark: true,
};

type Theme = typeof LIGHT;
type ThemeCtx = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeCtx>({
    theme: LIGHT,
    toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const theme = isDark ? DARK : LIGHT;
    function toggleTheme() {
        setIsDark((p) => !p);
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
