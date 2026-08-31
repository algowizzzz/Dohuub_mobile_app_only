import React from 'react';
import { Text } from 'react-native';
import { styles } from './SectionLabel.styles';

type Props = {
  label: string;
};

export default function SectionLabel({ label }: Props) {
  return <Text style={styles.label}>{label.toUpperCase()}</Text>;
}
