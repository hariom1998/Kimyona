import { Ionicons } from '@expo/vector-icons'
import { getBatteryLevelAsync, getBatteryStateAsync } from 'expo-battery'
import { LinearGradient } from 'expo-linear-gradient'
import * as Notifications from 'expo-notifications'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import ToggleSwitch from '../../components/toggleSwitch'
import { useThemeContext } from '../../contexts/themeContext'
import { RootStackScreenProps } from '../../navigation/types'
import {
  checkStatusAsync,
  toggleFetchTask,
} from '../../services/notificationService'

type Props = {}

export default function BatteryStatsScreen({
  navigation,
  route,
}: RootStackScreenProps<'batteryStats'>) {
  const [isRegistered, setIsRegistered] = React.useState(false)
  const [batteryLevel, setBatteryLevel] = useState<number>(0)
  const [batteryStatus, setBatteryStatus] = useState<number>(0)
  const [notificationPermission, setNotificationPermission] =
    useState<boolean>(false)

  const { colors, setThemeSwitch: setTheme, theme } = useThemeContext()

  useEffect(() => {
    checkStatusAsync()
      .then(initialIsRegistered => {
        setIsRegistered(initialIsRegistered)
      })
      .catch(e => console.log(e))
  }, [])

  useEffect(() => {
    Notifications.getPermissionsAsync()
      .then(({ status }) => {
        setNotificationPermission(status === 'granted')
      })
      .catch(e => console.log(e))
  }, [])

  const requestNotificationPermission = async () => {
    let { status: permissionStatus } = await Notifications.getPermissionsAsync()
    if (permissionStatus !== 'granted') {
      const { status: newPermissionStatus } =
        await Notifications.requestPermissionsAsync()
      permissionStatus = newPermissionStatus
    }
    if (permissionStatus !== 'granted') {
      alert(
        'You need to enable notifications in order to receive battery alerts.'
      )
      return
    }
    setNotificationPermission(true)
  }

  useEffect(() => {
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

  const onToggleAlarm = useCallback(async () => {
    await requestNotificationPermission()
    if (!notificationPermission) {
      return
    }

    toggleFetchTask()
      .then(() => {
        checkStatusAsync()
          .then(initialIsRegistered => {
            setIsRegistered(initialIsRegistered)
          })
          .catch(e => console.log(e))
      })
      .catch(e => console.log(e))
  }, [notificationPermission])

  return (
    <View
      className="flex-1 justify-between"
      style={{ backgroundColor: colors.white }}
    >
      <View>
        <View className="h-1/3 w-full justify-end ">
          <LinearGradient
            colors={['#ff4467', '#ff8e0b']}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <Text
              className="p-5 text-4xl w-2/3"
              style={{ color: colors.white }}
            >
              Battery Stats
            </Text>
          </LinearGradient>
        </View>

        <View style={{ padding: 10, flexDirection: 'row' }}>
          <View
            style={{
              padding: 10,
              backgroundColor: colors.gray1,
              borderRadius: 50,
            }}
          >
            <Text style={{ color: colors.black }}>Battery Level</Text>
          </View>
          <View
            style={{
              padding: 10,
              marginLeft: 10,

              backgroundColor: colors.gray1,
              borderRadius: 50,
            }}
          >
            <Text style={{ color: colors.black }}>{batteryLevel}%</Text>
          </View>
        </View>
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <View
            style={{
              padding: 10,
              backgroundColor: colors.gray1,
              borderRadius: 50,
            }}
          >
            <Text style={{ color: colors.black }}>
              Battery Alarm Notifcation Permission
            </Text>
          </View>
          <View
            style={{
              padding: 10,
              marginLeft: 10,
              backgroundColor: colors.gray1,
              borderRadius: 50,
            }}
          >
            <Text style={{ color: colors.black }}>
              {notificationPermission ? 'Granted' : 'Denied'}
            </Text>
          </View>
        </View>
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <View
            style={{
              padding: 10,
              backgroundColor: colors.gray1,
              borderRadius: 50,
            }}
          >
            <Text style={{ color: colors.black }}>Battery Alarm</Text>
          </View>
          <View
            style={{
              marginLeft: 10,
              backgroundColor: colors.gray1,
              borderRadius: 50,
              justifyContent: 'center',
            }}
          >
            <ToggleSwitch
              value={isRegistered && notificationPermission}
              onToggle={onToggleAlarm}
            />
          </View>
        </View>
      </View>
      <BaseButton
        onPress={() =>
          navigation.navigate('batteryAlarm', { autoPlaySound: true })
        }
        style={{
          backgroundColor: colors.gray1,
          margin: 30,
          padding: 0,
          borderRadius: 100,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            borderRadius: 20,
            padding: 10,
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: colors.white,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['#ff4467', '#ff8e0b']}
              style={{
                padding: 10,
              }}
            >
              <Ionicons name="alarm-outline" size={50} color={colors.white} />
            </LinearGradient>
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              justifyContent: 'center',
              paddingLeft: 10,
            }}
          >
            <Text className="text-2xl" style={{ color: colors.black }}>
              Test Alarn
            </Text>
            <Text style={{ color: colors.black }}>
              Tap to test Battery Alarm.
            </Text>
          </View>
        </View>
      </BaseButton>
    </View>
  )
}
