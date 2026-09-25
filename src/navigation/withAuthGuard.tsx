import React, { useEffect } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useIsSignedIn } from '../hooks/useRequireAuth';
import { useLoginPromptStore } from '../store/loginPromptStore';

/**
 * Safety net for account-only stack screens. Entry points already call
 * `requireAuth()` before navigating, but a guest can still land here through a
 * deep link or a path we did not gate — in that case step back to where they
 * came from (or Home) and show the sign-in prompt instead of a broken screen.
 */
export function withAuthGuard<P extends object>(Screen: React.ComponentType<P>, message?: string) {
  function Guarded(props: P) {
    const signedIn = useIsSignedIn();
    const navigation = useNavigation();

    useEffect(() => {
      if (signedIn) return;
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Home' } }] }),
        );
      }
      useLoginPromptStore.getState().open(message);
    }, [signedIn, navigation]);

    return signedIn ? <Screen {...props} /> : null;
  }

  Guarded.displayName = `withAuthGuard(${Screen.displayName || Screen.name || 'Screen'})`;
  return Guarded;
}
