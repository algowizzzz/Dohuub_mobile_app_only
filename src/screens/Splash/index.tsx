import React, { useEffect } from 'react';
import { Image, StatusBar, View, useWindowDimensions } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { splash } from '../../assets/images';
import { useSessionStore } from '../../store/sessionStore';
import { useAuthStore } from '../../store/authStore';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const MIN_SPLASH_MS = 1500;

function waitFor(store: { persist: { hasHydrated: () => boolean; onFinishHydration: (cb: () => void) => () => void } }): Promise<void> {
  if (store.persist.hasHydrated()) return Promise.resolve();
  return new Promise<void>(resolve => {
    const unsubscribe = store.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
}

function waitForHydration(): Promise<void> {
  return Promise.all([waitFor(useSessionStore), waitFor(useAuthStore)]).then(() => undefined);
}

export default function SplashScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      const minDelay = new Promise<void>(resolve => setTimeout(() => resolve(), MIN_SPLASH_MS));
      await Promise.all([waitForHydration(), minDelay]);
      if (cancelled) return;

      const hasOnboarded = useAuthStore.getState().hasOnboarded;
      if (!hasOnboarded) {
        navigation.replace('Onboarding');
        return;
      }

      const isAuthenticated = await useAuthStore.getState().restore();
      if (cancelled) return;

      const profileComplete = Boolean(useAuthStore.getState().user?.profileComplete);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            isAuthenticated
              ? profileComplete
                ? { name: 'Main', params: { screen: 'Home' } }
                : { name: 'CompleteProfile' }
              : { name: 'Welcome' },
          ],
        }),
      );
    };

    boot();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Image source={splash} style={{ width, height }} resizeMode="cover" />
    </View>
  );
}
