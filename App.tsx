import { AppRegistry } from 'react-native'
import { AppNavigation } from './src/navigation'
import BatteryAlarmScreen from './src/screens/BatteryAlarm'

AppRegistry.registerComponent('custom', () => BatteryAlarmScreen)
export default function App() {
  return <AppNavigation />
}
