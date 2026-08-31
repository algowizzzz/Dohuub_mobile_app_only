import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './AuthFooterLinks.styles';

type Props = {
  onCreateAccount: () => void;
};

export default function AuthFooterLinks({ onCreateAccount }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.muted}>Don't have an account? </Text>
        <TouchableOpacity onPress={onCreateAccount} hitSlop={8}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
