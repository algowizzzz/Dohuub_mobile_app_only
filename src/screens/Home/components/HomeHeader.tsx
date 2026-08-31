import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { logo } from '../../../assets/images';
import { colors } from '../../../styles';
import { useNotificationStore } from '../../../store/notificationStore';
import { useAuthStore } from '../../../store/authStore';
import NotificationsModal from '../../../components/ui/NotificationsModal';
import { styles } from './HomeHeader.styles';

type Props = {
  locationLabel?: string;
  onLocationPress?: () => void;
  onAvatarPress: () => void;
  addressLine?: string;
};

export default function HomeHeader({
  locationLabel,
  onLocationPress,
  onAvatarPress,
  addressLine,
}: Props) {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const notifications = useNotificationStore(state => state.notifications);
  const loadNotifications = useNotificationStore(state => state.load);
  const hasUnreadNotifications = notifications.some(n => !n.readAt);
  const avatarUrl = useAuthStore(state => state.user?.avatarUrl);

  useEffect(() => {
    loadNotifications().catch(() => {});
  }, [loadNotifications]);

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        {locationLabel && onLocationPress ? (
          <TouchableOpacity style={styles.locationPill} onPress={onLocationPress} activeOpacity={0.8}>
            <Icon name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.locationLabel} numberOfLines={1}>
              {locationLabel}
            </Text>
            <Icon name="chevron-down" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <Image source={logo} style={styles.logoImage} resizeMode="contain" />
            </View>
            <Text style={styles.brandName}>DoHuub</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => setNotificationsVisible(true)}
            hitSlop={8}
            style={styles.iconButton}
          >
            <Icon name="notifications-outline" size={22} color={colors.text} />
            {hasUnreadNotifications ? <View style={styles.badge} /> : null}
          </TouchableOpacity>

          <TouchableOpacity onPress={onAvatarPress} hitSlop={4}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon name="person-outline" size={18} color={colors.text} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {addressLine ? (
        <View style={styles.addressBanner}>
          <Icon name="location" size={16} color={colors.primary} style={styles.addressIcon} />
          <Text style={styles.addressText} numberOfLines={1}>
            {addressLine}
          </Text>
          <TouchableOpacity onPress={onLocationPress} hitSlop={8}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : onLocationPress ? (
        <View style={styles.emptyBanner}>
          <Icon name="location" size={16} color="#D97706" />
          <Text style={styles.emptyText} numberOfLines={2}>
            Add an address to get started
          </Text>
          <TouchableOpacity onPress={onLocationPress} hitSlop={8}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </View>
  );
}
