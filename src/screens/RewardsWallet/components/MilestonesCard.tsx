import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { CategoryProgress } from '../mapWallet';
import { styles } from './MilestonesCard.styles';

type Props = {
  categories: CategoryProgress[];
  lifetimePoints: number;
};

export default function MilestonesCard({ categories, lifetimePoints }: Props) {
  const achieved = categories.reduce((sum, category) => sum + category.filledDots, 0);
  const total = Math.max(categories.length * 4, 0);
  const remaining = Math.max(total - achieved, 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LinearGradient
          colors={['#F97316', '#EA580C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerIcon}
        >
          <Icon name="disc" size={22} color={colors.white} />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={styles.title}>Category Milestones</Text>
          <Text style={styles.subtitle}>Complete orders to earn bonus points</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statAchieved}>{achieved}</Text>
          <Text style={styles.statCaption}>Achieved</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statRemaining}>{remaining}</Text>
          <Text style={styles.statCaption}>Remaining</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statEarned}>+{lifetimePoints}</Text>
          <Text style={styles.statEarnedCaption}>Pts Earned</Text>
        </View>
      </View>

      {categories.length === 0 ? (
        <Text style={styles.empty}>No categories yet.</Text>
      ) : (
        categories.map(category => (
          <View key={category.id} style={styles.row}>
            <Icon name={category.icon} size={20} color={colors.text} />
            <Text style={styles.rowTitle} numberOfLines={1}>
              {category.title}
            </Text>
            <View style={styles.dots}>
              {[0, 1, 2, 3].map(index => (
                <View
                  key={index}
                  style={[styles.dot, index < category.filledDots && styles.dotFilled]}
                />
              ))}
            </View>
            <Icon name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        ))
      )}
    </View>
  );
}