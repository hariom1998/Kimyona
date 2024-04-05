import { StatusBar } from 'expo-status-bar'
import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View, useColorScheme } from 'react-native'
import { useThemeContext } from '../../../contexts/themeContext'
import ChargingBattery from './chargingBattery'

type Props = {
  isPlaying: boolean
  handlePauseAudio: () => void
  onPressStop: () => void
}

const BatteryAlarmView = ({
  handlePauseAudio,
  isPlaying,
  onPressStop,
}: Props) => {
  const { theme } = useThemeContext()
  const systemTheme = useColorScheme()
  const [currentTheme, setCurrentTheme] = useState('dark')

  useLayoutEffect(() => {
    if (theme) {
      setCurrentTheme(theme)
    } else if (systemTheme) {
      setCurrentTheme(systemTheme)
    }
  }, [systemTheme, theme])

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        style={currentTheme === 'dark' ? 'light' : 'dark'}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'green',
        }}
      >
        <ChargingBattery handlePauseAudio={handlePauseAudio} />
      </View>
    </>
  )
}

export default BatteryAlarmView

const styles = StyleSheet.create({})
