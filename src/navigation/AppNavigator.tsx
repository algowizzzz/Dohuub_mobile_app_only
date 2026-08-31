import React from 'react';
import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import type { RootStackParamList } from './types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['dohuub://'],
  config: {
    screens: {
      Payment: 'checkout/return',
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
}
