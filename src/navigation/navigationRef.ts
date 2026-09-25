import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/** Lets components outside a screen (e.g. global modals) navigate. */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
