import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('purple');
    const [fontSize, setFontSize] = useState('medium');
    const [animations, setAnimations] = useState(true);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('neuralchat-theme');
        const savedAccentColor = localStorage.getItem('neuralchat-accent');
        const savedFontSize = localStorage.getItem('neuralchat-fontsize');
        const savedAnimations = localStorage.getItem('neuralchat-animations');

        if (savedTheme) setTheme(savedTheme);
        if (savedAccentColor) setAccentColor(savedAccentColor);
        if (savedFontSize) setFontSize(savedFontSize);
        if (savedAnimations !== null) setAnimations(JSON.parse(savedAnimations));
    }, []);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        
        // Theme colors
        if (theme === 'light') {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8fafc');
            root.style.setProperty('--bg-tertiary', '#f1f5f9');
            root.style.setProperty('--bg-card', '#ffffff');
            root.style.setProperty('--bg-hover', '#f1f5f9');
            root.style.setProperty('--bg-input', '#f8fafc');
            
            root.style.setProperty('--text-primary', '#0f172a');
            root.style.setProperty('--text-secondary', '#475569');
            root.style.setProperty('--text-tertiary', '#64748b');
            root.style.setProperty('--text-muted', '#94a3b8');
            
            root.style.setProperty('--border-primary', '#e2e8f0');
            root.style.setProperty('--border-secondary', '#cbd5e1');
        } else {
            // Dark theme (default)
            root.style.setProperty('--bg-primary', '#0a0a0b');
            root.style.setProperty('--bg-secondary', '#111113');
            root.style.setProperty('--bg-tertiary', '#1a1a1d');
            root.style.setProperty('--bg-card', '#1e1e21');
            root.style.setProperty('--bg-hover', '#252529');
            root.style.setProperty('--bg-input', '#2a2a2f');
            
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b4b6c7');
            root.style.setProperty('--text-tertiary', '#8b8d98');
            root.style.setProperty('--text-muted', '#6c6e7b');
            
            root.style.setProperty('--border-primary', '#2a2a2f');
            root.style.setProperty('--border-secondary', '#3a3a3f');
        }

        // Accent colors
        const accentColors = {
            purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            blue: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            green: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            red: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
        };

        root.style.setProperty('--primary-gradient', accentColors[accentColor]);
        root.style.setProperty('--border-accent', accentColor === 'purple' ? '#667eea' : 
                                                 accentColor === 'blue' ? '#4facfe' :
                                                 accentColor === 'green' ? '#43e97b' :
                                                 accentColor === 'orange' ? '#fa709a' : '#ff6b6b');

        // Font size
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        root.style.setProperty('font-size', fontSizes[fontSize]);

        // Animations
        if (!animations) {
            root.style.setProperty('--transition-fast', '0ms');
            root.style.setProperty('--transition-normal', '0ms');
            root.style.setProperty('--transition-slow', '0ms');
        } else {
            root.style.setProperty('--transition-fast', '150ms ease-in-out');
            root.style.setProperty('--transition-normal', '250ms ease-in-out');
            root.style.setProperty('--transition-slow', '350ms ease-in-out');
        }

        // Save to localStorage
        localStorage.setItem('neuralchat-theme', theme);
        localStorage.setItem('neuralchat-accent', accentColor);
        localStorage.setItem('neuralchat-fontsize', fontSize);
        localStorage.setItem('neuralchat-animations', JSON.stringify(animations));

    }, [theme, accentColor, fontSize, animations]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        accentColor,
        setAccentColor,
        fontSize,
        setFontSize,
        animations,
        setAnimations
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};