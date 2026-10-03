import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, fontFamily, radius, spacing } from '../../../styles';

type Props = {
  onPress: () => void;
  onMyDeliveries: () => void;
  /** Requests still in progress — shown on the "My deliveries" link. */
  activeCount?: number;
};

/** Home entry point for DoHuub Delivery ("Send a Package"). */
export default function SendPackageCard({ onPress, onMyDeliveries, activeCount = 0 }: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.main} onPress={onPress} activeOpacity={0.85} testID="home-send-package">
        <LinearGradient
          colors={[colors.gradientCtaStart, colors.gradientCtaEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconTile}
        >
          <Icon name="cube" size={24} color={colors.white} />
        </LinearGradient>
        <View style={styles.text}>
          <Text style={styles.title}>Send a Package</Text>
          <Text style={styles.subtitle}>You set the fare — a DoHuub rider picks it up and delivers it.</Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textFaint} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={onMyDeliveries} activeOpacity={0.7} testID="home-my-deliveries">
        <Icon name="bicycle-outline" size={16} color={colors.primary} />
        <Text style={styles.linkText}>My deliveries</Text>
        {activeCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeCount} active</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: spacing.md,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 2,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.dividerSoft,
  },
  linkText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  badge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.infoLight,
  },
  badgeText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
