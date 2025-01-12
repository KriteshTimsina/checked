import { colors } from '@/constants/data';
import { useInitPreferences } from '@/hooks/useInitializePreferences';
import { createContext, useContext, useState } from 'react';

type Theme = {
  id: number;
  primary: string;
  secondary: string;
  selected: number;
};
type ThemeContextProps = {
  selectedTheme: Theme;
  onThemeSelect: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextProps | null>(null);

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(colors[0]);
  useInitPreferences();

  const onThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        onThemeSelect,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);

  if (themeContext === null) {
    throw new Error('Error getting theme');
  }

  return themeContext;
};

export default AppThemeProvider;
