import { useNavigation } from '@react-navigation/native'
import * as BackgroundFetch from 'expo-background-fetch'
import {
  BatteryState,
  getBatteryLevelAsync,
  getBatteryStateAsync,
} from 'expo-battery'
import * as Notifications from 'expo-notifications'
import React, { useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native'
import {
  checkStatusAsync,
  toggleFetchTask,
} from '../../services/notificationService'

export default function HomeScreen() {
  const navigation = useNavigation()
  const [isRegistered, setIsRegistered] = React.useState(false)
  const [batteryLevel, setBatteryLevel] = useState<number>(0)
  const [batteryStatus, setBatteryStatus] = useState<number>(0)
  const [status, setStatus] =
    useState<BackgroundFetch.BackgroundFetchStatus | null>(null)

  useEffect(() => {
    checkStatusAsync()
      .then(([initialStatus, initialIsRegistered]) => {
        setStatus(initialStatus)
        setIsRegistered(initialIsRegistered)
      })
      .catch(e => console.log(e))
  }, [])

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status: permissionStatus } =
        await Notifications.requestPermissionsAsync()
      if (permissionStatus !== 'granted') {
        alert(
          'You need to enable notifications in order to receive battery alerts.'
        )
        return
      }
    }

    requestNotificationPermission().catch(e => console.log(e))

    const intervalId = setInterval(() => {
      getBatteryLevelAsync()
        .then(level => {
          setBatteryLevel(Number((level * 100).toFixed(2)))
        })
        .catch(e => console.log(e))
      getBatteryStateAsync()
        .then(level => {
          setBatteryStatus(level as number)
        })
        .catch(e => console.log(e))
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (batteryLevel === 99 && batteryStatus === BatteryState.CHARGING) {
      navigation.navigate('batteryAlarm')
    }
  }, [batteryLevel, batteryStatus, navigation])

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Battery Level: {batteryLevel}%</Text>
      {batteryLevel >= 50 ? <Text> H E Y </Text> : null}
      <View className="justify-center items-center">
        <View className="m-10">
          <Text>
            Background fetch status:{' '}
            <Text className="font-bold">
              {status && BackgroundFetch.BackgroundFetchStatus[status]}
            </Text>
          </Text>
          <Text>
            Background fetch task name:{' '}
            <Text className="font-bold">
              {isRegistered
                ? 'Registered for Battery Alarm'
                : 'Not registered yet!'}
            </Text>
          </Text>
        </View>
        <View></View>
        <Button
          title={
            isRegistered ? 'Battery Alarm Enabled' : 'Battery Alarm Disabled'
          }
          onPress={() => {
            toggleFetchTask()
              .then(() => {
                checkStatusAsync()
                  .then(([initialStatus, initialIsRegistered]) => {
                    setStatus(initialStatus)
                    setIsRegistered(initialIsRegistered)
                  })
                  .catch(e => console.log(e))
              })
              .catch(e => console.log(e))
          }}
        />
        <Button
          title="Battery Alarm"
          onPress={() =>
            navigation.navigate('batteryAlarm', { autoPlaySound: true })
          }
        ></Button>
      </View>
    </View>
  )
}
