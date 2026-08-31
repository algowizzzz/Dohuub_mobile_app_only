import React from 'react';
import { View } from 'react-native';
import { styles } from './PaginationDots.styles';

type Props = {
  count: number;
  activeIndex: number;
};

export default function PaginationDots({ count, activeIndex }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
}
