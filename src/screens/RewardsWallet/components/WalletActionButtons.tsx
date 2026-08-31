import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './WalletActionButtons.styles';

type Props = {
  onReferAndEarn: () => void;
  onViewHistory: () => void;
};

export default function WalletActionButtons({ onReferAndEarn, onViewHistory }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.referButton} onPress={onReferAndEarn} activeOpacity={0.85}>
        <Icon name="people-outline" size={20} color="rgb(147, 51, 234)" />
        <Text style={styles.referLabel}>Refer & Earn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.historyButton} onPress={onViewHistory} activeOpacity={0.85}>
        <Icon name="time-outline" size={20} color="#1E293B" />
        <Text style={styles.historyLabel}>View History</Text>
      </TouchableOpacity>
    </View>
  );
}