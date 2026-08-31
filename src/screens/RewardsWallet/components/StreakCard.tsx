import React from 'react';
import { Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { StreakMarker } from '../mapWallet';
import { styles } from './StreakCard.styles';

type Props = {
  currentStreak: number;
  bestStreak: number;
  markers: StreakMarker[];
  nextWeeks: number | null;
};

export default function StreakCard({ currentStreak, bestStreak, markers, nextWeeks }: Props) {
  const weeksToGo = nextWeeks != null ? Math.max(0, nextWeeks - currentStreak) : 0;
  const progress =
    nextWeeks && nextWeeks > 0 ? Math.min((currentStreak / nextWeeks) * 100, 100) : 100;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <LinearGradient
          colors={['rgb(249, 115, 22)', 'rgb(239, 68, 68)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerIcon}
        >
          <Icon name="flame" size={22} color={colors.white} />
        </LinearGradient>
        <View style={styles.headerText}>
          <Text style={styles.title}>Activity Streak</Text>
          <Text style={styles.subtitle}>Keep ordering to earn bonus points!</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <View style={styles.statValueRow}>
            <Icon name="flame" size={28} color="rgb(249, 115, 22)" />
            <Text style={styles.currentValue}>{currentStreak}</Text>
          </View>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <View style={styles.statValueRow}>
            <Icon name="trophy" size={22} color="rgb(245, 158, 11)" />
            <Text style={styles.bestValue}>{bestStreak}</Text>
          </View>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      {nextWeeks != null ? (
        <View style={styles.progressBlock}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressCaption}>Progress to {nextWeeks} weeks</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['rgb(249, 115, 22)', 'rgb(239, 68, 68)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressHint}>
            {weeksToGo} more week{weeksToGo === 1 ? '' : 's'} to go
          </Text>
        </View>
      ) : null}

      <View style={styles.markers}>
        {markers.map(marker => (
          <View key={marker.weeks} style={styles.marker}>
            {marker.achieved ? (
              <LinearGradient
                colors={['rgb(249, 115, 22)', 'rgb(239, 68, 68)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.markerCircle}
              >
                <Text style={styles.markerTextAchieved}>{marker.weeks}w</Text>
              </LinearGradient>
            ) : (
              <View style={styles.markerCircleMuted}>
                <Text style={styles.markerText}>{marker.weeks}w</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Order from any Powered by DoHuub service each week to maintain your streak
      </Text>
    </View>
  );
}