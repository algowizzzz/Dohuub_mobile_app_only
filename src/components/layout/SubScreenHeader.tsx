import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './SubScreenHeader.styles';

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  /** When true, header applies top safe-area itself (use inside Modals). */
  includeTopInset?: boolean;
  topInset?: number;
};

export default function SubScreenHeader({
  title,
  subtitle,
  onBack,
  includeTopInset = false,
  topInset = 0,
}: Props) {
  return (
    <View
      style={[
        styles.wrap,
        includeTopInset ? { paddingTop: topInset + 8 } : null,
      ]}
    >
      <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={8}>
        <Icon name="chevron-back" size={26} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
