import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './InfoBox.styles';

type Props = {
  title: string;
  items: string[];
};

export default function InfoBox({ title, items }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.map(item => (
        <View key={item} style={styles.itemRow}>
          <View style={styles.bullet} />
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}
