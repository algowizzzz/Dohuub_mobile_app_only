import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ENV } from './src/config/env';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StripeProvider publishableKey={ENV.stripePublishableKey} urlScheme="dohuub">
          <AppNavigator />
        </StripeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
