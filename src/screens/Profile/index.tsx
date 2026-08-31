import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import MainScreenLayout from '../../components/layout/MainScreenLayout';
import HomeHeader from '../Home/components/HomeHeader';
import LogOutModal from './components/LogOutModal';
import DeleteAccountModal from './components/DeleteAccountModal';
import { useAuthStore } from '../../store/authStore';
import { useRewardsStore } from '../../store/rewardsStore';
import { usersApi } from '../../services/platformApi';
import { ApiError } from '../../services/ApiError';
import { colors } from '../../styles';
import ProfileCard from './components/ProfileCard';
import MenuRow from './components/MenuRow';
import DangerRow from './components/DangerRow';
import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const balance = useRewardsStore(state => state.balance);
  const loadBalance = useRewardsStore(state => state.loadBalance);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    loadBalance().catch(() => {});
  }, [loadBalance]);

  const goToWelcome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      }),
    );
  };

  const handleLogout = async () => {
    setLogoutVisible(false);
    await logout();
    goToWelcome();
  };

  const handleDeleteAccount = async () => {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await usersApi.deleteMe();
      await logout();
      setDeleteVisible(false);
      goToWelcome();
    } catch (err) {
      setDeleteError(ApiError.messageOf(err, 'The account could not be deleted.'));
      setDeleting(false);
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await usersApi.updatePreferences({ pushNotificationsEnabled: value });
    } catch {
      setNotificationsEnabled(!value);
    }
  };

  return (
    <MainScreenLayout>
      <HomeHeader onAvatarPress={() => {}} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard
          name={user?.fullName ?? ''}
          email={user?.email ?? ''}
          avatarUrl={user?.avatarUrl}
          onEditProfile={() => navigation.navigate('EditProfile')}
        />

        <View style={styles.group}>
          <MenuRow
            icon="gift-outline"
            label="Rewards Wallet"
            onPress={() => navigation.navigate('RewardsWallet')}
            rightElement={
              <View style={styles.pointsPill}>
                <Text style={styles.pointsPillText}>
                  {(balance?.balance ?? 0).toLocaleString()} pts
                </Text>
              </View>
            }
          />
          <MenuRow
            icon="people-outline"
            label="Refer a Friend"
            onPress={() => navigation.navigate('ReferFriend')}
            isLast
          />
        </View>

        <View style={styles.group}>
          <MenuRow
            icon="location-outline"
            label="Saved Addresses"
            onPress={() => navigation.navigate('SavedAddresses')}
          />
          <MenuRow
            icon="card-outline"
            label="Payment Methods"
            onPress={() => navigation.navigate('PaymentMethods')}
          />
          <MenuRow
            icon="notifications-outline"
            label="Notifications"
            type="toggle"
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
          />
          <MenuRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => navigation.navigate('HelpSupport')}
          />
          <MenuRow
            icon="shield-checkmark-outline"
            label="Terms of Service"
            onPress={() => navigation.navigate('TermsOfService')}
          />
          <MenuRow
            icon="shield-outline"
            label="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
            isLast
          />
        </View>

        <View style={styles.group}>
          <MenuRow
            icon="information-circle-outline"
            label="About DoHuub"
            onPress={() => navigation.navigate('AboutDoHuub')}
          />
          <DangerRow icon="log-out-outline" label="Log Out" onPress={() => setLogoutVisible(true)} />
          <DangerRow
            icon="trash-outline"
            label="Delete Account"
            destructive
            onPress={() => setDeleteVisible(true)}
          />
        </View>
      </ScrollView>

      <LogOutModal
        visible={logoutVisible}
        onClose={() => setLogoutVisible(false)}
        onConfirm={handleLogout}
      />

      <DeleteAccountModal
        visible={deleteVisible}
        confirming={deleting}
        error={deleteError}
        onClose={() => {
          if (deleting) return;
          setDeleteVisible(false);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteAccount}
      />
    </MainScreenLayout>
  );
}
