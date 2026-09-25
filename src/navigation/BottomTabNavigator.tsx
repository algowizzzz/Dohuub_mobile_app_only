import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import FloatingTabBar from './components/FloatingTabBar';
import HomeScreen from '../screens/Home';
import BookingsScreen from '../screens/Bookings';
import ChatScreen from '../screens/Chat';
import ProfileScreen from '../screens/Profile';
import MainScreenLayout from '../components/layout/MainScreenLayout';
import GuestLockedView from '../components/ui/GuestLockedView';
import { useIsSignedIn } from '../hooks/useRequireAuth';

const Tab = createBottomTabNavigator<MainTabParamList>();

// The tab bar already stops guests with the sign-in prompt; these stand-ins
// cover any other route into an account-only tab.
function BookingsTab() {
  const signedIn = useIsSignedIn();
  if (signedIn) return <BookingsScreen />;
  return (
    <MainScreenLayout>
      <GuestLockedView
        icon="calendar-outline"
        title="Your bookings live here"
        message="Sign in to book services and keep track of your appointments and orders."
      />
    </MainScreenLayout>
  );
}

function ChatTab() {
  const signedIn = useIsSignedIn();
  if (signedIn) return <ChatScreen />;
  return (
    <MainScreenLayout>
      <GuestLockedView
        icon="chatbubbles-outline"
        title="Meet your DoHuub assistant"
        message="Sign in to chat with our AI concierge and get help finding the right service."
      />
    </MainScreenLayout>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <FloatingTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsTab} />
      <Tab.Screen name="Chat" component={ChatTab} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
