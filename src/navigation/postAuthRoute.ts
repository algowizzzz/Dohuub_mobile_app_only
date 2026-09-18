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
