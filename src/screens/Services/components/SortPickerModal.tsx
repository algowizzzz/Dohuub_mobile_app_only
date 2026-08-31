import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { SORT_KEYS, SORT_LABELS, type SortKey } from '../sorting';
import { styles } from './SortPickerModal.styles';

type Props = {
  visible: boolean;
  selected: SortKey;
  onSelect: (key: SortKey) => void;
  onClose: () => void;
};

export default function SortPickerModal({ visible, selected, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.sheet}>
              <Text style={styles.title}>Sort by</Text>
              {SORT_KEYS.map(key => {
                const isSelected = key === selected;
                return (
                  <TouchableOpacity
                    key={key}
                    style={styles.row}
                    onPress={() => onSelect(key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.rowLabel, isSelected && styles.rowLabelSelected]}>
                      {SORT_LABELS[key]}
                    </Text>
                    {isSelected ? (
                      <Icon name="checkmark" size={18} color={colors.primary} />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
