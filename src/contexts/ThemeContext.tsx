import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'matrix' | 'cyberblade';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ilhamCryptoTheme');
    return (saved as ThemeMode) || 'matrix';
  });

  useEffect(() => {
    localStorage.setItem('ilhamCryptoTheme', theme);
    
    const root = document.documentElement;
    
    if (theme === 'matrix') {
      // Matrix Protocol - Black/Green
      root.style.setProperty('--primary', '160 84% 39%');
      root.style.setProperty('--primary-foreground', '220 20% 4%');
      root.style.setProperty('--accent', '43 96% 56%');
      root.style.setProperty('--accent-foreground', '220 20% 4%');
      root.style.setProperty('--emerald', '160 84% 39%');
      root.style.setProperty('--emerald-glow', '160 84% 50%');
      root.style.setProperty('--ring', '160 84% 39%');
    } else {
      // Cyber Blade - Deep Blue/Neon Pink/Purple
      root.style.setProperty('--primary', '280 70% 60%');
      root.style.setProperty('--primary-foreground', '220 20% 4%');
      root.style.setProperty('--accent', '330 90% 60%');
      root.style.setProperty('--accent-foreground', '220 20% 4%');
      root.style.setProperty('--emerald', '280 70% 60%');
      root.style.setProperty('--emerald-glow', '280 70% 70%');
      root.style.setProperty('--ring', '330 90% 60%');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'matrix' ? 'cyberblade' : 'matrix');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
