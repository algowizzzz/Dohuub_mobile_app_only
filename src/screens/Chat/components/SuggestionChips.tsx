import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './SuggestionChips.styles';

const SUGGESTIONS = [
  'Find cleaning service',
  'Book handyman',
  'Order groceries',
  'Beauty services near me',
];

type Props = {
  onSelect: (suggestion: string) => void;
};

export default function SuggestionChips({ onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      {SUGGESTIONS.map(suggestion => (
        <TouchableOpacity
          key={suggestion}
          style={styles.chip}
          onPress={() => onSelect(suggestion)}
          activeOpacity={0.8}
        >
          <Text style={styles.chipLabel}>{suggestion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
