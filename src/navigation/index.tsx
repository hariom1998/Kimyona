import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Linking, Platform, View } from 'react-native'
import {
  defaultDarkTheme,
  defaultLightTheme,
  useThemeContext,
} from '../contexts/themeContext'
import { navigationRef } from './rootNavigation'
import NavigationStack from './stack'
import { RootStackParamList } from './types'

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'

export function AppNavigation() {
  const [isReady, setIsReady] = useState(Platform.OS === 'web') // Don't persist state on web since it's based on URL
  const [initialState, setInitialState] = useState()
  const { colors, theme } = useThemeContext()

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()

        if (initialUrl === null) {
          // Only restore state if there's no deep link
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined

          if (state !== undefined) {
            // Exclude the screen you want to exclude from state persistence
            const filteredState = {
              ...state,
              // Assuming the screen you want to exclude is 'ScreenToExclude'
              routes: state.routes.filter(
                (route: { name: keyof RootStackParamList }) =>
                  route.name !== 'batteryAlarm'
              ),
            }
            setInitialState(filteredState)
          }
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState().catch(console.error)
    }
  }, [isReady])

  if (!isReady) {
    return null
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <NavigationContainer
        initialState={initialState}
        onStateChange={state =>
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
        }
        ref={navigationRef}
        theme={theme === 'dark' ? defaultDarkTheme : defaultLightTheme}
      >
        <NavigationStack />
      </NavigationContainer>
    </View>
  )
}
