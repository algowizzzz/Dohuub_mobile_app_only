import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  SignupEmail: undefined;
  VerifyOtp: { email: string };
  EnableLocation: undefined;
  CompleteProfile: undefined;
  SignupReferral: undefined;
  SignupAddresses: undefined;
  ForgotPassword: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  ChatDetail: { conversationId?: string; initialMessage?: string } | undefined;
  Services: { categoryId: string };
  VendorStore: { vendorId: string; categoryId?: string };
  Vendor: { vendorId: string };
  VendorReviews: { vendorId: string };
  ServiceDetails: { vendorId: string; serviceId: string };
  BookService: { vendorId: string; serviceId: string };
  Payment: { bookingId: string };
  HelpSupport: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  AboutDoHuub: undefined;
  PaymentMethods: undefined;
  EditPaymentCard: { cardId: string };
  SavedAddresses: undefined;
  AddAddress: { addressId?: string; type?: 'home' | 'work' | 'other' } | undefined;
  ReferFriend: undefined;
  RewardsWallet: undefined;
  PointsHistory: undefined;
  EditProfile: undefined;
  BookingDetail: { bookingId: string };
  LeaveReview: { bookingId: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
