import { useNavigation } from '@react-navigation/native'
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia'
import React, { useEffect } from 'react'
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { getRandomColor } from '../../utils/themeUtils'

export default function WelcomeScreen() {
  const navigation = useNavigation()
  const { height, width } = Dimensions.get('screen')

  const leftColor = useSharedValue('red')
  const rightColor = useSharedValue('blue')

  const colors = useDerivedValue(() => {
    return [leftColor.value, rightColor.value]
  })

  // Navigate to 'home' after 5 seconds
  useEffect(() => {
    setTimeout(() => {
      //  navigation.navigate('home')
    }, 5000)
  }, [navigation])

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
        onPress={() => {
          leftColor.value = withTiming(getRandomColor())
          rightColor.value = withTiming(getRandomColor())
        }}
      >
        <Text style={{ fontSize: 24 }}>WelcomeScreen</Text>
        <Button
          title="Go to Home"
          onPress={() => navigation.navigate('home')}
        />
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
})
