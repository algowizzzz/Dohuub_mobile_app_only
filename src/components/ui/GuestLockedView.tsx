import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PrimaryButton from './PrimaryButton';
import { navigationRef } from '../../navigation/navigationRef';
import { colors, fontFamily, radius, spacing } from '../../styles';

type Props = {
  icon: string;
  title: string;
  message: string;
};

/** Stand-in for an account-only tab while browsing as a guest. */
export default function GuestLockedView({ icon, title, message }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={30} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton
        label="Sign In"
        onPress={() => navigationRef.isReady() && navigationRef.navigate('Welcome')}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 96,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: '#E0EDFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    alignSelf: 'stretch',
  },
});
