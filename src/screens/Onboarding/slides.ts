export type OnboardingSlide = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    icon: 'infinite',
    title: 'Welcome to DoHuub',
    description:
      'Infinite Services - Your platform for cleaning, handyman, food, beauty, rentals, and caregiving',
  },
  {
    id: 'categories',
    icon: 'SquaresFour',
    title: 'Everything You Need, One App',
    description: '6 service categories to simplify your daily life and help your loved ones',
  },
  {
    id: 'booking',
    icon: 'CalendarCheck',
    title: 'Easy Booking Process',
    description: 'Select, customize, pay securely, and track your services in real-time',
  },
  {
    id: 'assistant',
    icon: 'ChatCircleDots',
    title: '24/7 AI Assistant & Secure Payments',
    description: 'Get instant help anytime. All payments processed securely through Stripe',
  },
];
