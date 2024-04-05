import React, { useEffect } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useThemeContext } from '../contexts/themeContext'

type Props = {
  onToggle: () => void
  value: boolean
}

const ToggleSwitch = ({ onToggle, value }: Props) => {
  const { colors, theme } = useThemeContext()
  const TOGGLE_BAR_WIDTH = 80
  const TOGGLE_BAR_HEIGHT = 40
  const HORIZONTAL_PADDING = 5
  const MOVABLE_WIDTH = TOGGLE_BAR_WIDTH - HORIZONTAL_PADDING
  const TOGGLE_SWITCH_SIZE = 30

  const ON_POSITION = HORIZONTAL_PADDING
  const OFF_POSITION = MOVABLE_WIDTH - TOGGLE_SWITCH_SIZE

  const rightStyle = useSharedValue(value ? ON_POSITION : OFF_POSITION)
  const colorStyle = useSharedValue(colors.white)

  const colorAnimationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: colorStyle.value,
    }
  })

  const rightAnimationStyle = useAnimatedStyle(() => {
    return {
      right: rightStyle.value,
    }
  })

  useEffect(() => {
    if (!value) {
      rightStyle.value = withSpring(OFF_POSITION)
      colorStyle.value = withTiming(colors.white)
    } else {
      rightStyle.value = withSpring(ON_POSITION)
      colorStyle.value = withTiming(theme === 'dark' ? 'green' : '#3FBA4F')
    }
  }, [
    value,
    rightStyle,
    OFF_POSITION,
    ON_POSITION,
    colorStyle,
    colors.black,
    colors.white,
    theme,
  ])
  return (
    <Pressable
      onPress={() => {
        onToggle()
      }}
    >
      <View
        style={{
          backgroundColor: colors.secondary,
          padding: 1,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          width: TOGGLE_BAR_WIDTH,
          height: TOGGLE_BAR_HEIGHT,
        }}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: TOGGLE_SWITCH_SIZE,
              width: TOGGLE_SWITCH_SIZE,

              borderRadius: 20,
            },
            rightAnimationStyle,
            colorAnimationStyle,
          ]}
        ></Animated.View>
      </View>
    </Pressable>
  )
}

export default ToggleSwitch

const styles = StyleSheet.create({})
