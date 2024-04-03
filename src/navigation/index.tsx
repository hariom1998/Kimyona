import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BatteryAlarmScreen from '../screens/BatteryAlarm'
import HomeScreen from '../screens/Home'
import WelcomeScreen from '../screens/Welcome'
import { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="batteryAlarm" component={BatteryAlarmScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
