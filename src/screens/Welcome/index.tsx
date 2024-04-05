import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia'
import React, { useCallback, useEffect } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import {
  BaseButton,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useThemeContext } from '../../contexts/themeContext'
import { getRandomColor } from '../../utils/themeUtils'

export default function WelcomeScreen() {
  const { colors: themeColors } = useThemeContext()
  const navigation = useNavigation()
  const { height, width } = Dimensions.get('screen')

  const leftColor = useSharedValue('red')
  const rightColor = useSharedValue('blue')

  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value]
  })

  const changeColor = useCallback(
    (duration?: number) => {
      leftColor.value = withTiming(getRandomColor(), {
        duration: duration ?? 5000,
      })
      rightColor.value = withTiming(getRandomColor(), {
        duration: duration ?? 5000,
      })
    },
    [leftColor, rightColor]
  )

  useEffect(() => {
    const interval = setInterval(changeColor, 3000)
    return () => clearInterval(interval)
  }, [changeColor])

  return (
    <View style={styles.container}>
      <Canvas style={styles.gradient}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={colors}
          />
        </Rect>
      </Canvas>
      <TouchableWithoutFeedback
        style={{
          width: width,
          height: height,

          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => changeColor(500)}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}
        >
          <Feather
            name="tool"
            size={100}
            color={themeColors.white}
            style={{
              opacity: 0.5,
              borderRadius: 100,
              borderWidth: 1,
              padding: 20,
              borderColor: themeColors.white,
            }}
          />
          <Text className="text-5xl h-3/4" style={{ color: themeColors.white }}>
            Kimyona
          </Text>
        </View>
        <BaseButton
          onPress={() => navigation.navigate('home')}
          style={{
            borderRadius: 100,
            position: 'absolute',
            bottom: 80,
            backgroundColor: 'transparent',
          }}
        >
          <Feather
            name="chevron-right"
            size={100}
            color={themeColors.white}
            style={{
              opacity: 0.5,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: themeColors.white,
            }}
          />
        </BaseButton>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
})
