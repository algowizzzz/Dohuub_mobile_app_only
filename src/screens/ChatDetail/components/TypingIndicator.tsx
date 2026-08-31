import React, { useEffect } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../../styles';
import { styles } from './TypingIndicator.styles';

function Dot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(-4, { duration: 300 }), withTiming(0, { duration: 300 })), -1, false),
    );

    return () => {
      cancelAnimation(translateY);
    };
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function TypingIndicator() {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Icon name="hardware-chip-outline" size={16} color={colors.primary} />
      </View>

      <View style={styles.bubble}>
        <Dot delay={0} />
        <Dot delay={120} />
        <Dot delay={240} />
      </View>
    </View>
  );
}
