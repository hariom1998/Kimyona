import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'

type Props = {
  onPress?: () => void
}

export default function ThemeButton({ onPress }: Props) {
  return (
    <BaseButton
      onPress={onPress}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        marginTop: 50,
        margin: 10,
        borderRadius: 50,
        backgroundColor: 'pink',
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: 'white',
          borderRadius: 50,
        }}
      >
        <Ionicons
          name="sunny-sharp"
          size={25}
          color={'white'}
          style={{
            padding: 5,
            margin: 0,
          }}
        />
      </View>
    </BaseButton>
  )
}
