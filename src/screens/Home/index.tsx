import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useRef } from 'react'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetMethods } from '../../components/bottomSheet'
import ThemeButton from '../../components/themeButton'
import { RootStackScreenProps } from '../../navigation/types'
export default function HomeScreen({
  navigation,
  route,
}: RootStackScreenProps<'home'>) {
  const onPressCard = () => navigation.navigate('batteryStats')
  const bottomSheetRef = useRef<BottomSheetMethods>(null)

  return (
    <View className="flex-1">
      <View className="h-1/3 bg-red-300 w-full justify-center ">
        <Text className="p-5 text-5xl align-middle" style={{ color: 'white' }}>
          Hey there. Whats Up.
        </Text>
      </View>
      <Card onPress={onPressCard} />

      <ThemeButton onPress={() => bottomSheetRef.current?.open()} />
      <BottomSheet ref={bottomSheetRef} />
    </View>
  )
}

function Card({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      className="m-5 justify-center items-center rounded-lg bg-slate-400"
      onPress={onPress}
    >
      <Ionicons name="battery-charging" size={100} />
    </TouchableOpacity>
  )
}
