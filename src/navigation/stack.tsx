import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import BatteryAlarmScreen from '../screens/BatteryAlarm'
import BatteryStatsScreen from '../screens/BatteryStats'
import HomeScreen from '../screens/Home'
import WelcomeScreen from '../screens/Welcome'
import { startNotificationHandlers } from '../services/notificationService'
import { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function NavigationStack() {
  startNotificationHandlers()

  return (
    <Stack.Navigator
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="batteryAlarm" component={BatteryAlarmScreen} />
      <Stack.Screen name="batteryStats" component={BatteryStatsScreen} />
    </Stack.Navigator>
  )
}
