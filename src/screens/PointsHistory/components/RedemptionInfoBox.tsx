import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './RedemptionInfoBox.styles';

const ITEMS = [
  { icon: 'card-outline', text: '100 points = $1.00 discount' },
  { icon: 'lock-closed-outline', text: 'Minimum 100 points per redemption' },
  { icon: 'shield-checkmark-outline', text: 'Points do not expire' },
  { icon: 'refresh-outline', text: 'Cancel a booking and any points you spent come straight back' },
];

export default function RedemptionInfoBox() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Icon name="information-circle-outline" size={16} color={colors.secondary} />
        </View>
        <View>
          <Text style={styles.title}>How redemption works</Text>
          <Text style={styles.subtitle}>What the rules actually are</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {ITEMS.map(item => (
        <View key={item.text} style={styles.itemRow}>
          <View style={styles.itemIconWrap}>
            <Icon name={item.icon} size={13} color={colors.secondary} />
          </View>
          <Text style={styles.itemText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}
