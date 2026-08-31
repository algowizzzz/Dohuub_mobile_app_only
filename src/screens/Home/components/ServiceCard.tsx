import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiVendorCategory } from '../../../services/catalogApi';
import { styles } from './ServiceCard.styles';

type Props = {
  category: ApiVendorCategory;
  onPress: () => void;
};

export default function ServiceCard({ category, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrap}>
        {category.image ? (
          <Image source={{ uri: category.image }} style={styles.image} resizeMode="contain" />
        ) : (
          <Icon name="sparkles-outline" size={32} color={colors.primary} />
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {category.title}
      </Text>
    </TouchableOpacity>
  );
}
