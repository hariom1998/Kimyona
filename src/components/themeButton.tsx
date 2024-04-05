import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import { useThemeContext } from '../contexts/themeContext'

type Props = {
  onPress?: () => void
}

export default function ThemeButton({ onPress }: Props) {
  const { colors, theme } = useThemeContext()
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
        backgroundColor: theme === 'light' ? 'pink' : '#8F3302',
      }}
    >
      <View
        style={{
          borderRadius: 50,
        }}
      >
        <Ionicons
          name={theme === 'light' ? 'sunny-sharp' : 'moon-sharp'}
          size={25}
          color={colors.white}
          style={{
            padding: 5,
            margin: 0,
          }}
        />
      </View>
    </BaseButton>
  )
}
