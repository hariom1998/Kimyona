import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import {
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeContext } from '../contexts/themeContext'
import Icon from './icon'
import Switch from './switch'

type Props = {}

export interface BottomSheetMethods {
  open: () => void
  close: () => void
}

const BottomSheet = forwardRef<BottomSheetMethods, Props>(({}, ref) => {
  const { colors, setTheme, theme } = useThemeContext()

  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  const [bottomSheetHeight, setBottomSheetHeight] = useState(1000)
  const OPEN = 0
  const CLOSE = bottomSheetHeight + insets.bottom
  const translateY = useSharedValue(CLOSE)
  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      backgroundColor:
        theme === 'dark' ? withTiming('#22272B') : withTiming('white'),
    }
  })
  const textAnimationStyle = useAnimatedStyle(() => {
    return { color: withTiming(colors.black) }
  })

  const lineAnimationStyle = useAnimatedStyle(() => {
    return { backgroundColor: withTiming(colors.black) }
  })

  const close = useCallback(() => {
    translateY.value = withSpring(CLOSE, {
      damping: 100,
      stiffness: 200,
    })
  }, [CLOSE, translateY])

  const open = useCallback(() => {
    translateY.value = withSpring(OPEN, {
      damping: 100,
      stiffness: 200,
    })
  }, [translateY])

  useImperativeHandle(ref, () => ({ open, close }), [open, close])

  const pan = Gesture.Pan()
    .onUpdate(event => {
      if (event.translationY < 0) {
        translateY.value = withSpring(OPEN, {
          damping: 100,
          stiffness: 200,
        })
      } else {
        translateY.value = withSpring(event.translationY, {
          damping: 100,
          stiffness: 200,
        })
      }
    })
    .onEnd(() => {
      if (translateY.value > 50) {
        translateY.value = withSpring(CLOSE, {
          damping: 100,
          stiffness: 200,
        })
      } else {
        translateY.value = withSpring(OPEN, {
          damping: 100,
          stiffness: 200,
        })
      }
    })

  return (
    <>
      <BackDrop
        translateY={translateY}
        openHeight={OPEN}
        closeHeight={CLOSE}
        close={close}
      />
      <GestureDetector gesture={pan}>
        <Animated.View
          onLayout={({ nativeEvent }) => {
            const { height } = nativeEvent.layout
            if (height) {
              setBottomSheetHeight(height)
              translateY.value = withTiming(height + insets.bottom)
            }
          }}
          style={[
            styles.bottomSheetContainer,
            { width: width * 0.9, bottom: insets.bottom },
            animationStyle,
          ]}
        >
          <Animated.View style={[styles.line, lineAnimationStyle]} />
          <Icon theme={theme} />
          <Animated.Text style={[styles.textTitle, textAnimationStyle]}>
            Choose a style
          </Animated.Text>
          <Animated.Text style={[styles.text, textAnimationStyle]}>
            Pop or subtle. Day or night.
          </Animated.Text>
          <Animated.Text style={[styles.text, textAnimationStyle]}>
            Customize your interface
          </Animated.Text>
          <Switch />
        </Animated.View>
      </GestureDetector>
    </>
  )
})

interface BackDropProps {
  translateY: SharedValue<number>
  openHeight: number
  closeHeight: number
  close: () => void
}

const BackDrop = ({
  closeHeight,
  openHeight,
  translateY,
  close,
}: BackDropProps) => {
  const backDropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [closeHeight, openHeight],
      [0, 0.5]
    )
    const display = opacity === 0 ? 'none' : 'flex'
    return { opacity, display }
  })

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('clicked')
        close()
      }}
    >
      <Animated.View style={[styles.backdropContainer, backDropAnimation]} />
    </TouchableWithoutFeedback>
  )
}

export default BottomSheet

const styles = StyleSheet.create({
  backdropContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    display: 'none',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  line: {
    position: 'absolute',
    backgroundColor: 'black',
    width: 40,
    height: 4,
    top: 8,
    borderRadius: 8,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 14,
  },
  text: { fontSize: 16, fontWeight: '500' },
})
