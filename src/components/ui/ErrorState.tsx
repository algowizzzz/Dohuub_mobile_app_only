import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './ErrorState.styles';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.wrap}>
      <Icon name="cloud-offline-outline" size={32} color={colors.textMuted} />
      <Text style={styles.message}>{message || 'Something went wrong. Please try again.'}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.retryLabel}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
