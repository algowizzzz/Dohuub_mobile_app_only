import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './StartChatButton.styles';

type Props = {
  onPress: () => void;
};

export default function StartChatButton({ onPress }: Props) {
  return (
    <View style={styles.hit}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <LinearGradient
          colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Icon name="chatbubble-ellipses" size={22} color={colors.white} />
          <Text
            style={styles.label}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.9}
          >
            Start a new chat
          </Text>

          <View style={styles.arrowWrap}>
            <Icon name="arrow-forward" size={18} color={colors.primary} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
