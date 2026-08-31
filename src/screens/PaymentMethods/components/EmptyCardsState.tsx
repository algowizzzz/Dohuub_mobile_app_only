import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './EmptyCardsState.styles';

export default function EmptyCardsState() {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Icon name="card-outline" size={26} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>No payment methods added</Text>
      <Text style={styles.subtitle}>Add a card to get started</Text>
    </View>
  );
}
