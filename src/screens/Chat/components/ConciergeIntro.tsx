import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import BotIcon from './BotIcon';
import { styles } from './ConciergeIntro.styles';

const FEATURES = [
  { icon: 'sparkles-outline', label: 'Smart help' },
  { icon: 'time-outline', label: '24/7' },
  { icon: 'shield-checkmark-outline', label: 'Private' },
];

type Props = {
  compact?: boolean;
};

export default function ConciergeIntro({ compact = false }: Props) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <LinearGradient
        colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.avatarRing, compact && styles.avatarRingCompact]}
      >
        <View style={[styles.avatarInner, compact && styles.avatarInnerCompact]}>
          <BotIcon size={compact ? 40 : 56} color={colors.primary} />
        </View>
      </LinearGradient>

      <Text style={[styles.title, compact && styles.titleCompact]}>
        {compact ? 'Your lifestyle concierge' : 'Your lifestyle\nconcierge'}
      </Text>

      {!compact ? (
        <>
          <Text style={styles.description}>
            Book cleaning, beauty, rides, groceries and more — in one conversation.
          </Text>

          <View style={styles.pillRow}>
            {FEATURES.map(feature => (
              <View key={feature.label} style={styles.pill}>
                <Icon name={feature.icon} size={13} color={colors.primary} />
                <Text style={styles.pillLabel}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}
