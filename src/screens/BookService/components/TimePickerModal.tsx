import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors } from '../../../styles';
import { styles } from './TimePickerModal.styles';

type TimeOption = { time: string; label: string };

type Props = {
  visible: boolean;
  options: TimeOption[];
  loading: boolean;
  selected: string | null;
  onSelect: (time: string) => void;
  onClose: () => void;
};

export default function TimePickerModal({
  visible,
  options,
  loading,
  selected,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.sheet}>
              <Text style={styles.title}>Select Time</Text>
              {loading ? (
                <ActivityIndicator color={colors.primary} style={styles.loading} />
              ) : options.length === 0 ? (
                <Text style={styles.emptyText}>No available time slots for this date.</Text>
              ) : (
                <View style={styles.grid}>
                  {options.map(option => {
                    const isSelected = option.time === selected;
                    return (
                      <TouchableOpacity
                        key={option.time}
                        style={[styles.slot, isSelected && styles.slotSelected]}
                        onPress={() => onSelect(option.time)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.slotLabel, isSelected && styles.slotLabelSelected]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
