import React, { useEffect } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import type { ApiNotification } from '../../services/engagementApi';
import { useNotificationStore } from '../../store/notificationStore';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { styles } from './NotificationsModal.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type IconMeta = { icon: string; color: string; bg: string };

const ICONS: Record<string, IconMeta> = {
  order: { icon: 'cube-outline', color: '#2E7AD9', bg: 'rgba(46,122,217,0.12)' },
  promo: { icon: 'notifications-outline', color: '#A855F7', bg: 'rgba(168,85,247,0.12)' },
  update: { icon: 'checkmark-circle-outline', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  reminder: { icon: 'time-outline', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  points: { icon: 'gift-outline', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  default: { icon: 'information-circle-outline', color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
};

function iconMetaFor(notification: ApiNotification): IconMeta {
  const blob = `${notification.data?.type ?? ''} ${notification.data?.kind ?? ''} ${notification.title} ${notification.body}`.toLowerCase();
  if (/promo|offer|discount|coupon|save\s*\d/.test(blob)) return ICONS.promo;
  if (/remind|upcoming/.test(blob)) return ICONS.reminder;
  if (/complete|rated|finished/.test(blob)) return ICONS.update;
  if (/point|reward|gift/.test(blob)) return ICONS.points;
  if (/progress|placed|order|book|package/.test(blob)) return ICONS.order;
  return ICONS.default;
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

function NotificationRow({
  notification,
  onPress,
}: {
  notification: ApiNotification;
  onPress: () => void;
}) {
  const isUnread = !notification.readAt;
  const meta = iconMetaFor(notification);

  return (
    <TouchableOpacity
      style={[styles.row, isUnread && styles.rowUnread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
        <Icon name={meta.icon} size={20} color={meta.color} />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {notification.title}
          </Text>
          {isUnread ? <View style={styles.unreadDot} /> : null}
        </View>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const notifications = useNotificationStore(state => state.notifications);
  const loading = useNotificationStore(state => state.loading);
  const error = useNotificationStore(state => state.error);
  const load = useNotificationStore(state => state.load);
  const markRead = useNotificationStore(state => state.markRead);

  const unreadCount = notifications.filter(n => !n.readAt).length;

  useEffect(() => {
    if (visible) load().catch(() => {});
  }, [visible, load]);

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
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 ? (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              ) : null}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={8}>
              <Icon name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {loading && notifications.length === 0 ? (
            <LoadingState />
          ) : error && notifications.length === 0 ? (
            <ErrorState message={error} onRetry={load} />
          ) : (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {notifications.length === 0 ? (
                <View style={styles.empty}>
                  <View style={styles.emptyCircle}>
                    <Icon name="notifications-outline" size={36} color={colors.textMuted} />
                  </View>
                  <Text style={styles.emptyTitle}>No notifications</Text>
                  <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>
              ) : (
                notifications.map(notification => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onPress={() => markRead(notification.id)}
                  />
                ))
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
