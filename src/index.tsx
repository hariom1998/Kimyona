import * as NavigationBar from 'expo-navigation-bar'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ThemeProvider } from './contexts/themeContext'
import { AppNavigation } from './navigation'

export default function Root() {
  NavigationBar.setPositionAsync('absolute').catch(console.warn)
  NavigationBar.setBackgroundColorAsync('#ffffff01').catch(console.warn)
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
