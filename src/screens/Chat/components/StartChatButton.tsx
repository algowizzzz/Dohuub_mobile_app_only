import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './StartChatButton.styles';

type Props = {
  onPress: () => void;
};

/**
 * Solid blue CTA — no LinearGradient.
 * Gradient was clipping / mis-painting this full-width row on both iOS and Android.
 */
export default function StartChatButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.hit, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Start a new chat"
    >
      <View style={styles.button}>
        <Icon name="chatbubble-ellipses" size={22} color={colors.white} />
        <Text style={styles.label} numberOfLines={1}>
          Start a new chat
        </Text>
        <View style={styles.arrowWrap}>
          <Icon name="arrow-forward" size={18} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}
