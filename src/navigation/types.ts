import type { StackScreenProps } from '@react-navigation/stack';
import { BatteryAlarmScreenParams } from '../screens/BatteryAlarm/types';
export type RootStackParamList ={
    welcome: undefined,
    home:undefined,
    batteryAlarm:BatteryAlarmScreenParams

}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }

  export type BatteryAlarmScreenProps=StackScreenProps<RootStackParamList,'batteryAlarm'>
