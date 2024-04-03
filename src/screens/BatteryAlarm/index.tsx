import notifee from '@notifee/react-native'
import { AVPlaybackStatus, Audio } from 'expo-av'
import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, Button, Text, View } from 'react-native'
import { BatteryAlarmScreenProps } from '../../navigation/types'

export default function BatteryAlarmScreen({ route }: BatteryAlarmScreenProps) {
  console.log(route?.params?.autoPlaySound)
  const [sound, setSound] = useState<Audio.Sound | null>()
  const [isPlaying, setIsPlaying] = useState(false)

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying)
    }
  }, [])

  const playSound = useCallback(async () => {
    console.log('Loading Sound')
    const { sound: audioTrack } = await Audio.Sound.createAsync(
      require('../../../assets/sounds/adiojori.mp3'),
      {
        shouldPlay: route?.params?.autoPlaySound,
      },
      onPlaybackStatusUpdate
    )
    setSound(audioTrack)

    console.log('Playing Sound')
  }, [onPlaybackStatusUpdate, route?.params?.autoPlaySound])

  useEffect(() => {
    if (!sound) {
      playSound().catch(e => console.log(e))
    }
    return sound
      ? () => {
          console.log('Unloading Sound')
          sound.unloadAsync().catch(e => console.log(e))
        }
      : undefined
  }, [playSound, sound])

  // useEffect(() => {
  //   notifee.cancelAllNotifications().catch(e => console.log(e))
  // }, [])

  const handlePlayPause = async () => {
    isPlaying ? await sound?.pauseAsync() : await sound?.playAsync()
    setIsPlaying(!isPlaying)
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>BatteryAlarmScreen</Text>

      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
      <Button
        title="Stop"
        onPress={() => {
          notifee.cancelAllNotifications().catch(e => console.log(e))
          BackHandler.exitApp()
        }}
      />
    </View>
  )
}
