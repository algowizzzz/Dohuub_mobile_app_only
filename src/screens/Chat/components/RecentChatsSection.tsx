import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../styles';
import type { ApiConversation } from '../../../services/engagementApi';
import { styles } from './RecentChatsSection.styles';

type Props = {
  conversations: ApiConversation[];
  onSelect: (id: string) => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function RecentChatsSection({ conversations, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Recent chats</Text>

      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="chatbubbles-outline" size={22} color={colors.textMuted} />
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      ) : (
        conversations.map(conversation => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.row}
            onPress={() => onSelect(conversation.id)}
            activeOpacity={0.7}
          >
            <View style={styles.rowIconWrap}>
              <Icon name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {conversation.title || 'Conversation'}
              </Text>
              {conversation._count ? (
                <Text style={styles.rowSubtitle} numberOfLines={1}>
                  {conversation._count.messages} message{conversation._count.messages === 1 ? '' : 's'}
                </Text>
              ) : null}
            </View>
            <Text style={styles.rowDate}>{formatDate(conversation.lastMessageAt)}</Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}
