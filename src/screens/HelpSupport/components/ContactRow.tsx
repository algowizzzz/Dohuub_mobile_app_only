import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './ContactRow.styles';

type Props = {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export default function ContactRow({ icon, title, subtitle, onPress }: Props) {
  const content = (
    <>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
}
