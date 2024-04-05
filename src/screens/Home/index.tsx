import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useRef } from 'react'
import { Text, View } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetMethods } from '../../components/bottomSheet'
import ThemeButton from '../../components/themeButton'
import { useThemeContext } from '../../contexts/themeContext'
import { RootStackScreenProps } from '../../navigation/types'
export default function HomeScreen({
  navigation,
  route,
}: RootStackScreenProps<'home'>) {
  const onPressCard = () => navigation.navigate('batteryStats')
  const bottomSheetRef = useRef<BottomSheetMethods>(null)
  const { colors } = useThemeContext()

  return (
    <View className="flex-1">
      <View className="h-1/4 bg-red-300 w-full justify-end ">
        <LinearGradient
          colors={['#ff4467', '#ff8e0b']}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Text className="p-5 text-4xl w-2/3" style={{ color: colors.white }}>
            Hey there. Whats Up.
          </Text>
        </LinearGradient>
      </View>
      <Card onPress={onPressCard} />

      <ThemeButton onPress={() => bottomSheetRef.current?.open()} />
      <BottomSheet ref={bottomSheetRef} />
    </View>
  )
}

function Card({ onPress }: { onPress: () => void }) {
  const { colors } = useThemeContext()
  return (
    <BaseButton
      onPress={onPress}
      style={{
        backgroundColor: colors.gray1,
        margin: 20,
        padding: 20,
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
            <Ionicons name="battery-charging" size={50} color={colors.white} />
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
            Battery Alarm
          </Text>
          <Text style={{ color: colors.black }}>
            Get notified whenever the battery is fully charged.
          </Text>
        </View>
      </View>
    </BaseButton>
  )
}
