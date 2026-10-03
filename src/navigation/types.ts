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
  CompleteProfile: { continueSetup?: boolean } | undefined;
  SignupReferral: undefined;
  SignupAddresses: undefined;
  ForgotPassword: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  ChatDetail: { conversationId?: string; initialMessage?: string } | undefined;
  Services: { categoryId: string };
  CommerceChoice: { categoryId?: string; mode?: 'groceries' | 'beauty' } | undefined;
  CommerceStores: { kind: 'food' | 'grocery' | 'beauty' };
  CommerceMenu: { vendorId: string; kind: 'food' | 'grocery' | 'beauty' };
  CommerceCheckout: { kind?: 'food' | 'grocery' | 'beauty' } | undefined;
  /** Pays a multi-store checkout (`checkoutId`) or a single legacy order (`orderId`). */
  OrderPayment: { orderId?: string; checkoutId?: string };
  OrderDetail: { orderId: string };
  ShoppingList: undefined;
  VendorStore: { vendorId: string; categoryId?: string };
  Vendor: { vendorId: string };
  VendorReviews: { vendorId: string };
  RentalsList: undefined;
  RentalDetail: { propertyId: string };
  RentalDates: { propertyId: string };
  RentalStayDetails: { propertyId: string; checkIn: string; checkOut: string };
  RentalConfirm: {
    propertyId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    specialRequests?: string;
  };
  ServiceDetails: { vendorId: string; serviceId: string };
  BookService: { vendorId: string; serviceId: string };
  Payment: { bookingId: string };
  HelpSupport: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  AboutDoHuub: undefined;
  PaymentMethods: undefined;
  EditPaymentCard: { cardId: string };
  /** `mode: 'select'` — opened from a booking/checkout flow: tapping a row picks it and goes back. */
  SavedAddresses: { mode?: 'select' } | undefined;
  /** `select: true` — a new address becomes the selected one and the screen returns to the flow. */
  AddAddress: { addressId?: string; type?: 'home' | 'work' | 'other'; select?: boolean } | undefined;
  ReferFriend: undefined;
  RewardsWallet: undefined;
  PointsHistory: undefined;
  EditProfile: undefined;
  BookingDetail: { bookingId: string };
  LeaveReview: { bookingId: string };
  /** Profile → Display currency; open to guests too. */
  CurrencyPicker: undefined;
  /** DoHuub Delivery: a package, or (with `orderId`) a rider for the customer's own paid marketplace order. */
  SendPackage: { orderId?: string } | undefined;
  DeliveryDetail: { deliveryId: string };
  MyDeliveries: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
