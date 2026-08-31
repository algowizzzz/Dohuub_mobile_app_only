import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './DatePickerModal.styles';

type DateOption = { id: string; label: string };

type Props = {
  visible: boolean;
  options: DateOption[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string, label: string) => void;
  onClose: () => void;
};

export default function DatePickerModal({
  visible,
  options,
  loading,
  selectedId,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.sheet}>
              <Text style={styles.title}>Select Date</Text>
              {loading ? (
                <ActivityIndicator color={colors.primary} style={styles.loading} />
              ) : options.length === 0 ? (
                <Text style={styles.emptyText}>No available dates in the next two weeks.</Text>
              ) : (
                options.map(option => {
                  const isSelected = option.id === selectedId;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={styles.row}
                      onPress={() => onSelect(option.id, option.label)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.rowLabel, isSelected && styles.rowLabelSelected]}>
                        {option.label}
                      </Text>
                      {isSelected ? <Icon name="checkmark" size={18} color={colors.primary} /> : null}
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
