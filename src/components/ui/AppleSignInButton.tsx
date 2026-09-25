import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { isAppleAuthSupported } from '../../services/appleAuth';
import { colors } from '../../styles';

type Props = {
  onPress: () => void;
  busy?: boolean;
  /** 'white' on the blue auth screens, 'black' on light backgrounds. */
  variant?: 'white' | 'black';
  type?: 'sign-in' | 'sign-up' | 'continue';
  testID?: string;
};

const TYPES = {
  'sign-in': AppleButton.Type.SIGN_IN,
  'sign-up': AppleButton.Type.SIGN_UP,
  continue: AppleButton.Type.CONTINUE,
};

/**
 * Apple's own ASAuthorizationAppleIDButton — App Review expects the system
 * button rather than a custom look-alike. Renders nothing where Sign in with
 * Apple is unavailable (Android, iOS < 13).
 *
 * The system button sizes its own label from its height, so the Google and
 * email buttons are matched to it (see AUTH_BUTTON_HEIGHT in styles) rather
 * than the other way round — its text is not stylable from JS on iOS.
 */
export default function AppleSignInButton({
  onPress,
  busy,
  variant = 'white',
  type = 'sign-in',
  testID,
}: Props) {
  if (!isAppleAuthSupported) return null;

  return (
    <View
      testID={testID}
      style={[styles.wrap, busy && styles.busy]}
      pointerEvents={busy ? 'none' : 'auto'}
    >
      <AppleButton
        buttonStyle={variant === 'white' ? AppleButton.Style.WHITE : AppleButton.Style.BLACK}
        buttonType={TYPES[type]}
        cornerRadius={12}
        style={styles.button}
        onPress={onPress}
      />
      {busy ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="small" color={variant === 'white' ? colors.text : colors.white} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  busy: {
    opacity: 0.7,
  },
  button: {
    width: '100%',
    height: 52,
  },
  spinner: {
    ...StyleSheet.absoluteFill,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 18,
  },
});
