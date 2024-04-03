import notifee, {
    AndroidCategory,
    AndroidImportance,
    AndroidVisibility,
} from '@notifee/react-native'
import * as BackgroundFetch from 'expo-background-fetch'
import { BackgroundFetchResult } from 'expo-background-fetch'
import { BatteryState, getBatteryLevelAsync, getBatteryStateAsync } from 'expo-battery'
import * as TaskManager from 'expo-task-manager'

export const sendBatteryNotification = async ({
    title,
    body,
  }: {
    title: string
    body?: string
  }) => {
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
      title,
      body,
      android: {
        vibrationPattern: [
          1000, 500, 1000, 1000, 500, 1000, 1000, 500, 1000, 1000, 500, 1000,
          1000, 500, 1000, 1000, 500, 1000,
        ],
        channelId: channelId,
        smallIcon: 'ic_launcher_foreground',
        category: AndroidCategory.ALARM,
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
        circularLargeIcon: true,
        largeIcon: 'ic_launcher_foreground',
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
    await sendBatteryNotification({
      title: 'Battery Full!',
      body: 'Your battery is fully charged!',
    })
  }
  return BackgroundFetchResult.NewData
})

export const checkStatusAsync = async (): Promise<[BackgroundFetch.BackgroundFetchStatus|null, boolean]> => {
    const initialStatus =  await BackgroundFetch.getStatusAsync()
    const initialIsRegistered = await  TaskManager.isTaskRegisteredAsync(BATTERY_TASK)
       return [initialStatus, initialIsRegistered]

  }

  export async function registerBackgroundTaskAsync() {
    return BackgroundFetch.registerTaskAsync(BATTERY_TASK, {
      minimumInterval: 10, // 10 seconds
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    })
  }
  
 export  async function unregisterBackgroundTaskAsync() {
    return BackgroundFetch.unregisterTaskAsync(BATTERY_TASK)
  }

  export const toggleFetchTask = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BATTERY_TASK)
    console.log(isRegistered)
    if (isRegistered) {
      await unregisterBackgroundTaskAsync()
    } else {
      await registerBackgroundTaskAsync()
    }
  }