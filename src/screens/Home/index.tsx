import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native'
import { useNavigation } from '@react-navigation/native'
import * as BackgroundFetch from 'expo-background-fetch'
import {
  BatteryState,
  getBatteryLevelAsync,
  getBatteryStateAsync,
} from 'expo-battery'
import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
  const navigation = useNavigation()
  const [isRegistered, setIsRegistered] = React.useState(false)
  const [batteryLevel, setBatteryLevel] = useState<number>(0)
  const [batteryStatus, setBatteryStatus] = useState<number>(0)
  const [status, setStatus] =
    useState<BackgroundFetch.BackgroundFetchStatus | null>(null)

  const checkStatusAsync = async () => {
    const initialStatus = await BackgroundFetch.getStatusAsync()
    const initialIsRegistered =
      await TaskManager.isTaskRegisteredAsync(BATTERY_TASK)
    setStatus(initialStatus)
    setIsRegistered(initialIsRegistered)
  }

  useEffect(() => {
    checkStatusAsync().catch(e => console.log(e))
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

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundTaskAsync()
    } else {
      await registerBackgroundTaskAsync()
    }

    return checkStatusAsync()
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text>Battery Level: {batteryLevel}%</Text>
      {batteryLevel >= 50 ? <Text> H E Y </Text> : null}
      <View style={styles.screen}>
        <View style={styles.textContainer}>
          <Text>
            Background fetch status:{' '}
            <Text style={styles.boldText}>
              {status && BackgroundFetch.BackgroundFetchStatus[status]}
            </Text>
          </Text>
          <Text>
            Background fetch task name:{' '}
            <Text style={styles.boldText}>
              {isRegistered ? BATTERY_TASK : 'Not registered yet!'}
            </Text>
          </Text>
        </View>
        <View style={styles.textContainer}></View>
        <Button
          title={
            isRegistered
              ? 'Unregister Background Notification task'
              : 'Register Background Notification task'
          }
          onPress={() => toggleFetchTask()}
        />
        <Button
          title="Battery Alarm"
          onPress={() =>
            navigation.navigate('batteryAlarm', { autoPlaySound: true })
          }
        ></Button>
        <Button
          onPress={() => sendBackgroundNotification()}
          title="Send Notification"
        ></Button>
      </View>
    </View>
  )
}

const sendBackgroundNotification = async () => {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'fullScreenChannel',
    name: 'Battery Alarm',
    badge: true,
    bypassDnd: true,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'adiojori',
  })

  // Display a notification
  await notifee.displayNotification({
    title: 'Incoming Call',
    body: 'BRUH' + ' is Calling...',
    android: {
      vibrationPattern: [
        1000, 500, 1000, 1000, 500, 1000, 1000, 500, 1000, 1000, 500, 1000,
        1000, 500, 1000, 1000, 500, 1000,
      ],
      channelId: channelId,
      smallIcon: 'ic_launcher_round',
      category: AndroidCategory.CALL,
      loopSound: true,
      autoCancel: false,
      sound: 'adiojori',
      ongoing: true,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'openBatteryAlarm',
        launchActivity: 'com.trollboi.Kimyona.CustomActivity',
      },
      fullScreenAction: {
        id: 'fullScreen',
        launchActivity: 'com.trollboi.Kimyona.CustomActivity',
      },
      actions: [
        {
          title: 'Stop',
          pressAction: {
            id: 'stopAlarm',
          },
        },
      ],
      lightUpScreen: true,
      colorized: true,
    },
  })
}

// Define the name for the background task
const BATTERY_TASK = 'batteryTask'

// Register the background task
TaskManager.defineTask(BATTERY_TASK, async () => {
  const batteryInfo = await getBatteryLevelAsync()
  const batteryPercentage = Number((batteryInfo * 100).toFixed(2))
  console.log('running background task', batteryPercentage)
  const batteryStatus = await getBatteryStateAsync()
  if (batteryPercentage >= 100 && batteryStatus === BatteryState.CHARGING) {
    await sendBackgroundNotification()
  }
  return BackgroundFetch.BackgroundFetchResult.NewData
})

async function registerBackgroundTaskAsync() {
  return BackgroundFetch.registerTaskAsync(BATTERY_TASK, {
    minimumInterval: 10, // 10 seconds
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  })
}

async function unregisterBackgroundTaskAsync() {
  return BackgroundFetch.unregisterTaskAsync(BATTERY_TASK)
}

function CustomComponent() {
  return (
    <View>
      <Text>A custom component</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
})
