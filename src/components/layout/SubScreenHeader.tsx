import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './SubScreenHeader.styles';

type Props = {
  title: string;
  onBack: () => void;
};

export default function SubScreenHeader({ title, onBack }: Props) {
  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={8}>
        <Icon name="chevron-back" size={26} color={colors.text} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}
