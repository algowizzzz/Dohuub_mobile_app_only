import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PrimaryButton from '../../../components/ui/PrimaryButton';
import { colors, fontFamily, radius, spacing } from '../../../styles';

type Props = {
  onSignIn: () => void;
  onSignUp: () => void;
};

/** Takes the place of ProfileCard while browsing as a guest. */
export default function GuestProfileCard({ onSignIn, onSignUp }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Icon name="person" size={28} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>Guest</Text>
          <Text style={styles.subtitle}>
            Sign in to book services, order products and earn rewards.
          </Text>
        </View>
      </View>

      <PrimaryButton label="Sign In" onPress={onSignIn} />
      <TouchableOpacity style={styles.signUp} onPress={onSignUp} activeOpacity={0.7}>
        <Text style={styles.signUpText}>
          New to DoHuub? <Text style={styles.signUpLink}>Create an account</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: '#E0EDFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  signUp: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  signUpText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  signUpLink: {
    fontFamily: fontFamily.semiBold,
    color: colors.primary,
  },
});
