import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './NextButton.styles';

type Props = {
  label: string;
  onPress: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
};

export default function NextButton({ label, onPress, showBack, onBackPress }: Props) {
  return (
    <View style={styles.row}>
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.8}>
          <Icon name="chevron-back" size={18} color="#FFFFFF" style={styles.backIcon} />
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.nextLabel}>{label}</Text>
        <Icon name="chevron-forward" size={18} color="#1D4ADD" style={styles.nextIcon} />
      </TouchableOpacity>
    </View>
  );
}
