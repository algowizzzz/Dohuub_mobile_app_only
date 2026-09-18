import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './TypingIndicator.styles';

function Dot({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: -4,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, translateY]);

  return <Animated.View style={[styles.dot, { transform: [{ translateY }] }]} />;
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
