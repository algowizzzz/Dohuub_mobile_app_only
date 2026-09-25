import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../styles';
import { styles, TEAL_GRADIENT } from './bookingStyles';

/**
 * A 135° gradient painted behind its parent's content. The parent owns the
 * radius, border and padding (with overflow hidden); LinearGradient carrying
 * those itself renders a doubled, offset box on iOS.
 */
export function GradientFill({ colors: stops }: { colors: string[] }) {
  return (
    <LinearGradient
      colors={stops}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}

/** The pinned bottom bar with the teal full-width action. */
export function BookingFooter({
  label,
  onPress,
  disabled = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled || loading}
        onPress={onPress}
        style={[styles.cta, (disabled || loading) && styles.ctaDisabled]}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        <GradientFill colors={TEAL_GRADIENT} />
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.ctaText}>{label}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
