import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './SignupFooterLinks.styles';

type Props = {
  onSignIn: () => void;
};

export default function SignupFooterLinks({ onSignIn }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.muted}>Already have an account? </Text>
        <TouchableOpacity onPress={onSignIn} hitSlop={8}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
