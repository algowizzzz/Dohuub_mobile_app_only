import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import sessionReducer, { setHasHydrated, setSession, setUser as setSessionUser } from './sessionSlice';
import authReducer, { setHasOnboarded } from './authSlice';

async function readZustandBlob(key: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Record<string, unknown> } | Record<string, unknown>;
    return (parsed as { state?: Record<string, unknown> })?.state ?? (parsed as Record<string, unknown>);
  } catch {
    return null;
  }
}

const sessionPersistConfig = {
  key: 'dohuub-session',
  storage: AsyncStorage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'expiresAt'] as string[],
};

const authPersistConfig = {
  key: 'dohuub-auth',
  storage: AsyncStorage,
  whitelist: ['hasOnboarded'] as string[],
};

const rootReducer = combineReducers({
  session: persistReducer(sessionPersistConfig, sessionReducer),
  auth: persistReducer(authPersistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store, null, () => {
  void (async () => {
    const session = store.getState().session;
    if (!session.accessToken) {
      const legacy = await readZustandBlob('dohuub-session');
      if (legacy?.accessToken) {
        store.dispatch(
          setSession({
            accessToken: String(legacy.accessToken),
            refreshToken: String(legacy.refreshToken || ''),
            expiresAt: String(legacy.expiresAt || ''),
          }),
        );
        if (legacy.user) {
          store.dispatch(setSessionUser(legacy.user as never));
        }
      }
    }

    if (!store.getState().auth.hasOnboarded) {
      const legacyAuth = await readZustandBlob('dohuub-auth');
      if (legacyAuth?.hasOnboarded) {
        store.dispatch(setHasOnboarded(true));
      }
    }

    store.dispatch(setHasHydrated(true));

    try {
      // Drop legacy Zustand keys after Redux persist is live.
      const reduxSession = await AsyncStorage.getItem('persist:dohuub-session');
      if (reduxSession) await AsyncStorage.removeItem('dohuub-session');
      const reduxAuth = await AsyncStorage.getItem('persist:dohuub-auth');
      if (reduxAuth) await AsyncStorage.removeItem('dohuub-auth');
    } catch {
      /* ignore */
    }
  })();
});
