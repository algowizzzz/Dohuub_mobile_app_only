import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './ErrorBanner.styles';

type Props = {
  message?: string | null;
  onDark?: boolean;
};

export default function ErrorBanner({ message, onDark = false }: Props) {
  if (!message) return null;

  return (
    <View style={[styles.wrap, onDark && styles.wrapOnDark]}>
      <Icon
        name="alert-circle"
        size={18}
        color={onDark ? colors.white : colors.danger}
        style={styles.icon}
      />
      <Text style={[styles.text, onDark && styles.textOnDark]}>{message}</Text>
    </View>
  );
}
