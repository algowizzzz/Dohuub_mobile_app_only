import React from 'react';
import { Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import { styles } from './PhotoSourceSheet.styles';

type Props = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onTakePhoto: () => void;
  onChooseFromLibrary: () => void;
  onRemovePhoto?: () => void;
  onCancel: () => void;
};

export default function PhotoSourceSheet({
  visible,
  title = 'Update profile photo',
  subtitle,
  onTakePhoto,
  onChooseFromLibrary,
  onRemovePhoto,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.sheet}>
              <View style={styles.grabber} />

              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              </View>

              <Pressable
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={onTakePhoto}
              >
                <View style={styles.optionIconWrap}>
                  <Icon name="camera-outline" size={22} color={colors.primary} />
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionLabel}>Take Photo</Text>
                  <Text style={styles.optionDescription}>Use your camera to snap a new photo</Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={onChooseFromLibrary}
              >
                <View style={styles.optionIconWrap}>
                  <Icon name="images-outline" size={22} color={colors.primary} />
                </View>
                <View style={styles.optionTextCol}>
                  <Text style={styles.optionLabel}>Choose from Library</Text>
                  <Text style={styles.optionDescription}>Pick an existing photo</Text>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>

              {onRemovePhoto ? (
                <>
                  <View style={styles.divider} />
                  <Pressable
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                    onPress={onRemovePhoto}
                  >
                    <View style={[styles.optionIconWrap, styles.optionIconWrapDanger]}>
                      <Icon name="trash-outline" size={20} color={colors.danger} />
                    </View>
                    <View style={styles.optionTextCol}>
                      <Text style={[styles.optionLabel, { color: colors.danger }]}>
                        Remove Photo
                      </Text>
                    </View>
                  </Pressable>
                </>
              ) : null}

              <Pressable
                style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.7 }]}
                onPress={onCancel}
              >
                <Text style={styles.cancelLabel}>Cancel</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
