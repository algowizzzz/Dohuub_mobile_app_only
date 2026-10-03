import React from 'react';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import { navigationRef } from './navigationRef';
import LoginRequiredModal from '../components/ui/LoginRequiredModal';
import GlobalCartFab from '../components/commerce/GlobalCartFab';
import type { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['dohuub://'],
  config: {
    screens: {
      Payment: 'checkout/return',
      DeliveryDetail: 'deliveries/:deliveryId',
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <RootNavigator />
      <GlobalCartFab />
      <LoginRequiredModal />
    </NavigationContainer>
  );
}
