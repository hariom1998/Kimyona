import { AppRegistry } from 'react-native'
import 'react-native-gesture-handler'
import Root from './src'
import BatteryAlarmScreen from './src/screens/BatteryAlarm'

AppRegistry.registerComponent('custom', () => BatteryAlarmScreen)
export default Root
