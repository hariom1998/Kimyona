import { Feather, Ionicons } from '@expo/vector-icons'
import notifee from '@notifee/react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { BackHandler, StyleSheet, View } from 'react-native'
import { BaseButton } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  handlePauseAudio: () => void
}

const ChargingBattery = ({ handlePauseAudio }: Props) => {
  const [stopped, setStopped] = useState(false)
  const paddingOuter = useSharedValue(1)
  const paddingInner = useSharedValue(1)
  const animatedOuterStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: paddingOuter.value }],
    }
  })

  const animatedInnerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: paddingInner.value }],
    }
  })

  const stopAnimation = useCallback(() => {
    paddingInner.value = withSpring(2)
    paddingOuter.value = withSpring(1)
    setStopped(true)
    handlePauseAudio()
    notifee.cancelAllNotifications().catch(e => console.log(e))
  }, [handlePauseAudio, paddingInner, paddingOuter])

  useEffect(() => {
    paddingOuter.value = withRepeat(withTiming(2, { duration: 2000 }), -1, true)
    paddingInner.value = withRepeat(withTiming(2, { duration: 1000 }), -1, true)
  }, [paddingInner, paddingOuter])

  return (
    <>
      <View
        style={{
          height: '50%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: '#3E9B4F',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 70,
              borderRadius: 200,
            },
            animatedOuterStyle,
          ]}
        >
          <Animated.View
            style={[
              {
                backgroundColor: '#C9E8CA',

                justifyContent: 'center',
                alignItems: 'center',
                padding: 50,
                borderRadius: 200,
              },
              animatedInnerStyle,
            ]}
          ></Animated.View>
        </Animated.View>

        <View style={{ position: 'absolute' }}>
          <Feather
            name="battery-charging"
            size={100}
            color="black"
            style={{
              transform: [{ rotate: '-90deg' }],
            }}
          />
        </View>
      </View>
      {!stopped ? (
        <BaseButton
          onPress={stopAnimation}
          style={{
            borderRadius: 100,
            position: 'absolute',
            bottom: 80,
            backgroundColor: 'white',
          }}
        >
          <Ionicons
            name="chevron-forward"
            size={40}
            color="black"
            style={{
              borderRadius: 50,
              padding: 40,
            }}
          />
        </BaseButton>
      ) : (
        <BaseButton
          onPress={() => {
            BackHandler.exitApp()
          }}
          style={{
            borderRadius: 100,
            position: 'absolute',
            bottom: 80,
            backgroundColor: '#3FBA4F',
          }}
        >
          <Ionicons
            name="checkmark"
            size={40}
            color="black"
            style={{
              borderRadius: 50,
              padding: 40,
            }}
          />
        </BaseButton>
      )}
    </>
  )
}

export default ChargingBattery

const styles = StyleSheet.create({})
