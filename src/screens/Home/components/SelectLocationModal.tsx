import React from 'react';
import { Dimensions, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { ADDRESS_TYPE_META, formatAddressLine, type Address } from '../../SavedAddresses/addresses';
import { styles } from './SelectLocationModal.styles';

type Props = {
  visible: boolean;
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onClose: () => void;
};

export default function SelectLocationModal({
  visible,
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const listMaxHeight = Math.round(Dimensions.get('window').height * 0.46);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Service Location</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={8}>
              <Icon name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[styles.list, { maxHeight: listMaxHeight }]}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {addresses.length === 0 ? (
              <View style={styles.empty}>
                <Icon name="location-outline" size={44} color={colors.primary} />
                <Text style={styles.emptyTitle}>No saved addresses</Text>
                <Text style={styles.emptySubtitle}>Add an address to get started</Text>
              </View>
            ) : (
              addresses.map(address => {
                const meta = ADDRESS_TYPE_META[address.type];
                const isSelected = address.id === selectedId;
                return (
                  <TouchableOpacity
                    key={address.id}
                    style={[styles.card, isSelected && styles.cardSelected]}
                    onPress={() => onSelect(address.id)}
                    activeOpacity={0.85}
                  >
                    <Icon
                      name="location"
                      size={20}
                      color={isSelected ? colors.primary : colors.textMuted}
                      style={styles.pin}
                    />
                    <View style={styles.info}>
                      <View style={styles.labelRow}>
                        <Text style={styles.label}>{meta.label}</Text>
                        {address.isDefault ? (
                          <View style={[styles.defaultBadge, isSelected && styles.defaultBadgeOnSelected]}>
                            <Text style={styles.defaultBadgeText}>Default</Text>
                          </View>
                        ) : null}
                        {isSelected ? (
                          <Icon name="checkmark" size={20} color={colors.primary} style={styles.check} />
                        ) : null}
                      </View>
                      <Text style={styles.line} numberOfLines={2}>
                        {formatAddressLine(address)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onAddNew} activeOpacity={0.88}>
              <LinearGradient
                colors={['#4CA6FA', '#1D4ADD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addButton}
              >
                <Icon name="add" size={20} color={colors.white} />
                <Text style={[styles.addButtonLabel, styles.addButtonLabelSpaced]}>Add New Address</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
