import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './MenuRow.styles';

type Props = {
  icon: string;
  label: string;
  isLast?: boolean;
  // Optional trailing content (e.g. the PWA's points pill on "Rewards
  // Wallet") that replaces the default chevron for link rows.
  rightElement?: React.ReactNode;
} & (
  | { type?: 'link'; onPress: () => void }
  | { type: 'toggle'; value: boolean; onValueChange: (value: boolean) => void }
);

export default function MenuRow(props: Props) {
  const { icon, label, isLast, rightElement } = props;

  const content = (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={16} color={colors.primary} />
      </View>

      <Text style={styles.label}>{label}</Text>

      {props.type === 'toggle' ? (
        <Switch
          value={props.value}
          onValueChange={props.onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      ) : rightElement ? (
        rightElement
      ) : (
        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </View>
  );

  if (props.type === 'toggle') {
    return content;
  }

  return (
    <TouchableOpacity onPress={props.onPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}
