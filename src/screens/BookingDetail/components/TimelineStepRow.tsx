import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { TimelineStep } from '../timeline';
import { styles } from './TimelineStepRow.styles';

type Props = {
  step: TimelineStep;
  isLast: boolean;
};

export default function TimelineStepRow({ step, isLast }: Props) {
  const connectorStyle =
    step.state === 'done'
      ? styles.connectorDone
      : step.state === 'active'
        ? styles.connectorActive
        : null;

  return (
    <View style={styles.row}>
      <View style={styles.markerColumn}>
        {step.state === 'done' ? (
          <View style={styles.doneCircle}>
            <Icon name="checkmark" size={14} color={colors.white} />
          </View>
        ) : step.state === 'active' ? (
          <View style={styles.activeCircle}>
            <ActivityIndicator size="small" color={colors.white} />
          </View>
        ) : (
          <View style={styles.upcomingCircle}>
            <View style={styles.upcomingDot} />
          </View>
        )}
        {!isLast ? <View style={[styles.connector, connectorStyle]} /> : null}
      </View>

      <View style={[styles.textCol, isLast && { paddingBottom: 0 }]}>
        <Text style={[styles.title, step.state === 'upcoming' && styles.titleMuted]}>
          {step.title}
        </Text>
        <Text style={styles.description}>{step.description}</Text>
        {step.timestamp ? <Text style={styles.timestamp}>{step.timestamp}</Text> : null}
      </View>
    </View>
  );
}
