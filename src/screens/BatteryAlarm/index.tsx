import notifee from '@notifee/react-native'
import { AVPlaybackStatus, Audio } from 'expo-av'
import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BatteryAlarmScreenProps } from '../../navigation/types'
import BatteryAlarmView from './views/batteryAlarm'

export default function BatteryAlarmScreen({ route }: BatteryAlarmScreenProps) {
  const [sound, setSound] = useState<Audio.Sound | null>()
  const [isPlaying, setIsPlaying] = useState(false)

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying)
    }
  }, [])

  const playSound = useCallback(async () => {
    const { sound: audioTrack } = await Audio.Sound.createAsync(
      require('../../../assets/sounds/adiojori.mp3'),
      {
        shouldPlay: route?.params?.autoPlaySound,
      },
      onPlaybackStatusUpdate
    )
    setSound(audioTrack)
  }, [onPlaybackStatusUpdate, route?.params?.autoPlaySound])

  useEffect(() => {
    if (!sound) {
      playSound().catch(e => console.log(e))
    }
    return sound
      ? () => {
          sound.unloadAsync().catch(e => console.log(e))
        }
      : undefined
  }, [playSound, sound])

  const handlePauseAudio = async () => {
    await sound?.pauseAsync()
    setIsPlaying(false)
  }

  const onPressStop = useCallback(async () => {
    await notifee.cancelAllNotifications().catch(e => console.log(e))
    BackHandler.exitApp()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BatteryAlarmView
        handlePauseAudio={handlePauseAudio}
        onPressStop={onPressStop}
        isPlaying={isPlaying}
      />
    </GestureHandlerRootView>
  )
}
