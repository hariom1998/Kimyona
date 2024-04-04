import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  DarkTheme,
  DefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useColorScheme } from 'react-native'

export type Theme = 'light' | 'dark'

interface ColorPalette {
  primary: string
  secondary: string
  white: string
  black: string
  // Add more colors as needed
}

export type ThemeSwitch = 'system' | 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  themeSwitch: ThemeSwitch
  setTheme: (themeSwitch: ThemeSwitch) => void
  colors: ColorPalette
}

const defaultLightColors: ColorPalette = {
  primary: '#FFFFFF',
  secondary: '#CCCCCC',
  white: '#FFFFFF',
  black: '#000000',
  // Add default light mode colors
}

const defaultDarkColors: ColorPalette = {
  white: '#000000',
  black: '#FFFFFF',
  primary: '#000000',
  secondary: '#333333',
  // Add default dark mode colors
}

export const defaultDarkTheme: NavigationTheme = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: defaultDarkColors.primary,
    background: defaultDarkColors.primary,
  },
}

export const defaultLightTheme: NavigationTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: defaultLightColors.primary,
    background: defaultLightColors.primary,
  },
}

const ThemeContext = createContext({} as ThemeContextValue)

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: any) => {
  const systemTheme = useColorScheme()
  const [userTheme, setUserTheme] = useState<Theme | null>(null)
  const [themeSwitch, setThemeSwitch] = useState<ThemeSwitch>('system')

  useEffect(() => {
    const fetchThemeFromStorage = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('userTheme')
        if (storedTheme !== null) {
          setThemeSwitch(storedTheme as ThemeSwitch)
          if (storedTheme === 'system' && systemTheme) {
            setUserTheme(systemTheme)
          }
        }
      } catch (error) {
        console.error('Error retrieving user theme from AsyncStorage:', error)
        setThemeSwitch('system')
        if (systemTheme) {
          setUserTheme(systemTheme)
        }
      }
    }

    fetchThemeFromStorage().catch(error => {
      console.error('Error fetching theme:', error)
    })
  }, [systemTheme])

  const setTheme = useCallback(
    async (theme: ThemeSwitch) => {
      try {
        await AsyncStorage.setItem('themeSwitch', theme)
        setThemeSwitch(theme)
        if (theme === 'system') {
          if (systemTheme) {
            setUserTheme(systemTheme)
          }
        } else {
          setUserTheme(theme)
        }
      } catch (error) {
        console.error('Error setting user theme in AsyncStorage:', error)
      }
    },
    [systemTheme]
  )
  console.log(themeSwitch)

  const colors = userTheme === 'dark' ? defaultDarkColors : defaultLightColors
  const theme = useMemo(
    () => userTheme ?? (systemTheme === 'dark' ? 'dark' : 'light'),
    [systemTheme, userTheme]
  )
  const values = useMemo(
    () => ({ theme, themeSwitch, setTheme, colors }),
    [theme, themeSwitch, setTheme, colors]
  )

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  )
}
