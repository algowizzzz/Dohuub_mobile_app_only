import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { ADDRESS_TYPE_META, type AddressType } from '../../SavedAddresses/addresses';
import { styles } from './AddressTypeSelector.styles';

const TYPES: AddressType[] = ['home', 'work', 'other'];

type Props = {
  value: AddressType;
  onChange: (type: AddressType) => void;
};

export default function AddressTypeSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {TYPES.map(type => {
        const meta = ADDRESS_TYPE_META[type];
        const isActive = value === type;
        return (
          <TouchableOpacity
            key={type}
            style={[styles.option, isActive && styles.optionActive]}
            onPress={() => onChange(type)}
            activeOpacity={0.8}
          >
            <Icon name={meta.icon} size={20} color={isActive ? colors.primary : colors.textMuted} />
            <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
              {meta.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
