import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../styles';
import { styles } from './LoadingState.styles';

export default function LoadingState() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
