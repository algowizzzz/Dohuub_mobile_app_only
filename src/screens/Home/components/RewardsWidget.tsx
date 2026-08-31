import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './RewardsWidget.styles';

type Props = {
  points: number;
  weeklyStreak: number;
  onPress: () => void;
};

export default function RewardsWidget({ points, weeklyStreak, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.side}>
        <Icon name="gift" size={20} color={styles.giftColor.color} />
        <Text style={styles.text}>{points.toLocaleString()} pts</Text>
      </View>
      <View style={styles.side}>
        <Icon name="flame" size={20} color={styles.flameColor.color} />
        <Text style={styles.text}>
          {weeklyStreak} week{weeklyStreak === 1 ? '' : 's'} streak
        </Text>
      </View>
    </TouchableOpacity>
  );
}
