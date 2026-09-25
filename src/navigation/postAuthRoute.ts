import { CommonActions } from '@react-navigation/native';
import type { CustomerUser } from '../store/authStore';

/**
 * After auth, new customers finish location → profile → referral → addresses.
 * Anyone who already finished first-run (or has a complete profile) goes Home.
 */
export function postAuthRoute(
  customer: Pick<CustomerUser, 'profileComplete' | 'hasCompletedOnboarding'>,
): { name: 'Main'; params: { screen: 'Home' } } | { name: 'EnableLocation' } {
  if (customer.hasCompletedOnboarding || customer.profileComplete) {
    return { name: 'Main', params: { screen: 'Home' } };
  }
  return { name: 'EnableLocation' };
}

type NavLike = {
  getState: () => { routes: Array<{ name: string; key: string }> } | undefined;
  dispatch: (action: ReturnType<typeof CommonActions.reset>) => void;
};

/**
 * Navigate after a successful sign-in. A guest who was sent here by the
 * "Sign in required" prompt already has the app underneath the auth screens —
 * when no first-run setup is needed, drop the auth screens and return them to
 * what they were browsing instead of restarting at Home.
 */
export function navigateAfterAuth(navigation: NavLike, customer: Parameters<typeof postAuthRoute>[0]) {
  const target = postAuthRoute(customer);
  const routes = navigation.getState()?.routes ?? [];
  const firstAuth = routes.findIndex(r => AUTH_ROUTES.has(r.name));
  const underneath = firstAuth > 0 ? routes.slice(0, firstAuth) : [];

  if (target.name === 'Main' && underneath.some(r => r.name === 'Main')) {
    navigation.dispatch(CommonActions.reset({ index: underneath.length - 1, routes: underneath }));
    return;
  }
  navigation.dispatch(CommonActions.reset({ index: 0, routes: [target] }));
}

const AUTH_ROUTES = new Set(['Welcome', 'Login', 'Signup', 'SignupEmail', 'VerifyOtp', 'ForgotPassword']);
