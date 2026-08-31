import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ChatMessage } from '../messages';
import { styles } from './MessageBubble.styles';

type Props = {
  message: ChatMessage;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {!isUser ? (
        <View style={styles.avatar}>
          <Icon name="hardware-chip-outline" size={16} color={colors.primary} />
        </View>
      ) : null}

      <View style={styles.column}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}>
            {message.text}
          </Text>
        </View>
        <Text style={[styles.time, isUser ? styles.timeUser : styles.timeAssistant]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}
