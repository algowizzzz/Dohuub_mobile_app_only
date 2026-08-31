import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CalendarTabIcon, ChatTabIcon, HomeTabIcon, UserTabIcon } from '../../components/icons/TabIcons';
import { styles } from './FloatingTabBar.styles';

const TAB_ICONS: Record<string, React.ComponentType<{ color: string; size?: number }>> = {
  Home: HomeTabIcon,
  Bookings: CalendarTabIcon,
  Chat: ChatTabIcon,
  Profile: UserTabIcon,
};

const TAB_LABELS: Record<string, string> = {
  Home: 'Home',
  Bookings: 'Bookings',
  Chat: 'AI',
  Profile: 'Profile',
};

export default function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 12) }]}>
      <View style={styles.barShadow}>
        <LinearGradient
          colors={['#4CA6FA', '#1D4ADD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bar}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const Icon = TAB_ICONS[route.name] ?? HomeTabIcon;
            const label = TAB_LABELS[route.name] ?? route.name;
            const color = isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)';

            const handlePress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabTouchable}
                onPress={handlePress}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
              >
                <View style={styles.item}>
                  <Icon color={color} size={Platform.OS === 'ios' ? 22 : 22} />
                  <Text
                    style={[styles.label, isFocused && styles.labelActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
                  >
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </LinearGradient>
      </View>
    </View>
  );
}
