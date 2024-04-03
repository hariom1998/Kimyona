import notifee, { EventType } from '@notifee/react-native'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect } from 'react'
import { Button, Text, View } from 'react-native'

export default function WelcomeScreen() {
  const navigation = useNavigation()

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log(type, detail.pressAction)
    if (type === EventType.PRESS) {
      console.log('User pressed notification with id: ', detail.pressAction?.id)
      if (detail.pressAction?.id === 'openBatteryAlarm') {
        navigation.navigate('batteryAlarm', { autoPlaySound: false })
      }
    }
    if (type === EventType.ACTION_PRESS) {
      const pressActionId = detail.pressAction?.id
      if (pressActionId === 'stopAlarm') {
        notifee.cancelAllNotifications().catch(e => console.log(e))
      }
    }
  })

  notifee.onForegroundEvent(({ type, detail }) => {
    console.log(type, detail.pressAction)
    if (type === EventType.PRESS) {
      console.log('User pressed notification with id: ', detail.pressAction?.id)
      if (detail.pressAction?.id === 'openBatteryAlarm') {
        navigation.navigate('batteryAlarm')
      }
    }
    if (type === EventType.ACTION_PRESS) {
      const pressActionId = detail.pressAction?.id
      if (pressActionId === 'stopAlarm') {
        notifee.cancelAllNotifications().catch(e => console.log(e))
      }
    }
  })

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('home')
    }, 5000)
  }, [navigation])

  return (
    <View className="flex-1 justify-center items-stretch ">
      <LinearGradient
        colors={['#F9F5F6', '#F8E8EE', '#F2BED1']}
        className="flex-1 justify-center items-center"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text className="text-3xl">WelcomeScreen</Text>
        <Button
          title="Go to Home"
          onPress={() => navigation.navigate('home')}
        ></Button>
      </LinearGradient>
    </View>
  )
}
