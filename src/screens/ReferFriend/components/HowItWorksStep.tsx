import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './HowItWorksStep.styles';

type Props = {
  icon: string;
  title: string;
  description: string;
  isLast?: boolean;
};

export default function HowItWorksStep({ icon, title, description, isLast }: Props) {
  return (
    <View style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={16} color="rgb(126, 34, 206)" />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}