import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import { styles } from './ChatInputBar.styles';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
};

export default function ChatInputBar({ value, onChangeText, onSend }: Props) {
  const canSend = value.trim().length > 0;

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask me anything…"
        placeholderTextColor={colors.textMuted}
        multiline
      />
      <TouchableOpacity
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!canSend}
        hitSlop={8}
      >
        <Icon name="arrow-forward" size={18} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}
