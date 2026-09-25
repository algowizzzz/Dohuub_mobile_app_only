import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import { withAuthGuard } from './withAuthGuard';
import { colors } from '../styles';
import SplashScreen from '../screens/Splash';
import OnboardingScreen from '../screens/Onboarding';
import WelcomeScreen from '../screens/Auth/Welcome';
import LoginScreen from '../screens/Auth/Login';
import SignupScreen from '../screens/Auth/Signup';
import SignupEmailScreen from '../screens/Auth/SignupEmail';
import EnableLocationScreen from '../screens/Auth/EnableLocation';
import CompleteProfileScreen from '../screens/Auth/CompleteProfile';
import SignupReferralScreen from '../screens/Auth/SignupReferral';
import SignupAddressesScreen from '../screens/Auth/SignupAddresses';
import VerifyOtpScreen from '../screens/Auth/VerifyOtp';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword';
import ChatDetailScreen from '../screens/ChatDetail';
import ServicesScreen from '../screens/Services';
import VendorStoreScreen from '../screens/VendorStore';
import VendorScreen from '../screens/Vendor';
import VendorReviewsScreen from '../screens/VendorReviews';
import ServiceDetailsScreen from '../screens/ServiceDetails';
import BookServiceScreen from '../screens/BookService';
import PaymentScreen from '../screens/Payment';
import HelpSupportScreen from '../screens/HelpSupport';
import TermsOfServiceScreen from '../screens/TermsOfService';
import PrivacyPolicyScreen from '../screens/PrivacyPolicy';
import AboutDoHuubScreen from '../screens/AboutDoHuub';
import PaymentMethodsScreen from '../screens/PaymentMethods';
import EditPaymentCardScreen from '../screens/PaymentMethods/EditCard';
import SavedAddressesScreen from '../screens/SavedAddresses';
import AddAddressScreen from '../screens/AddAddress';
import ReferFriendScreen from '../screens/ReferFriend';
import RewardsWalletScreen from '../screens/RewardsWallet';
import PointsHistoryScreen from '../screens/PointsHistory';
import EditProfileScreen from '../screens/EditProfile';
import BookingDetailScreen from '../screens/BookingDetail';
import LeaveReviewScreen from '../screens/LeaveReview';
import CommerceChoiceScreen from '../screens/Commerce/CommerceChoice';
import CommerceStoresScreen from '../screens/Commerce/CommerceStores';
import CommerceMenuScreen from '../screens/Commerce/CommerceMenu';
import CommerceCheckoutScreen from '../screens/Commerce/CommerceCheckout';
import OrderPaymentScreen from '../screens/Commerce/OrderPayment';
import OrderDetailScreen from '../screens/Commerce/OrderDetail';
import ShoppingListScreen from '../screens/ShoppingList';
import RentalsListScreen from '../screens/Rentals/RentalsListScreen';
import RentalDetailScreen from '../screens/Rentals/RentalDetailScreen';
import RentalDatesScreen from '../screens/Rentals/RentalDatesScreen';
import RentalStayDetailsScreen from '../screens/Rentals/RentalStayDetailsScreen';
import RentalConfirmScreen from '../screens/Rentals/RentalConfirmScreen';

// Account-only screens. Entry points gate with requireAuth(); these guards
// catch anything that slips past (deep links, missed buttons).
const guarded = {
  ChatDetail: withAuthGuard(ChatDetailScreen, 'Sign in to chat with the DoHuub assistant.'),
  CommerceCheckout: withAuthGuard(CommerceCheckoutScreen, 'Sign in to check out your cart.'),
  OrderPayment: withAuthGuard(OrderPaymentScreen, 'Sign in to pay for your order.'),
  OrderDetail: withAuthGuard(OrderDetailScreen, 'Sign in to view your orders.'),
  ShoppingList: withAuthGuard(ShoppingListScreen, 'Sign in to see your Shopping List.'),
  BookService: withAuthGuard(BookServiceScreen, 'Sign in to book this service.'),
  Payment: withAuthGuard(PaymentScreen, 'Sign in to complete your payment.'),
  RentalConfirm: withAuthGuard(RentalConfirmScreen, 'Sign in to book this property.'),
  PaymentMethods: withAuthGuard(PaymentMethodsScreen, 'Sign in to manage your payment methods.'),
  EditPaymentCard: withAuthGuard(EditPaymentCardScreen, 'Sign in to manage your payment methods.'),
  SavedAddresses: withAuthGuard(SavedAddressesScreen, 'Sign in to manage your saved addresses.'),
  AddAddress: withAuthGuard(AddAddressScreen, 'Sign in to save an address.'),
  ReferFriend: withAuthGuard(ReferFriendScreen, 'Sign in to refer friends and earn rewards.'),
  RewardsWallet: withAuthGuard(RewardsWalletScreen, 'Sign in to earn and redeem reward points.'),
  PointsHistory: withAuthGuard(PointsHistoryScreen, 'Sign in to see your points history.'),
  EditProfile: withAuthGuard(EditProfileScreen, 'Sign in to edit your profile.'),
  BookingDetail: withAuthGuard(BookingDetailScreen, 'Sign in to view your bookings.'),
  LeaveReview: withAuthGuard(LeaveReviewScreen, 'Sign in to leave a review.'),
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const mainAppScreenOptions = {
  contentStyle: { backgroundColor: colors.white },
};

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="SignupEmail" component={SignupEmailScreen} />
      <Stack.Screen name="EnableLocation" component={EnableLocationScreen} />
      <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />
      <Stack.Screen name="SignupReferral" component={SignupReferralScreen} />
      <Stack.Screen name="SignupAddresses" component={SignupAddressesScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} options={mainAppScreenOptions} />
      <Stack.Screen name="ChatDetail" component={guarded.ChatDetail} options={mainAppScreenOptions} />
      <Stack.Screen name="Services" component={ServicesScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="CommerceChoice" component={CommerceChoiceScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="CommerceStores" component={CommerceStoresScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="CommerceMenu" component={CommerceMenuScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="CommerceCheckout" component={guarded.CommerceCheckout} options={mainAppScreenOptions} />
      <Stack.Screen name="OrderPayment" component={guarded.OrderPayment} options={mainAppScreenOptions} />
      <Stack.Screen name="OrderDetail" component={guarded.OrderDetail} options={mainAppScreenOptions} />
      <Stack.Screen name="ShoppingList" component={guarded.ShoppingList} options={mainAppScreenOptions} />
      <Stack.Screen name="VendorStore" component={VendorStoreScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="Vendor" component={VendorScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="VendorReviews" component={VendorReviewsScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="RentalsList" component={RentalsListScreen} />
      <Stack.Screen name="RentalDetail" component={RentalDetailScreen} />
      <Stack.Screen name="RentalDates" component={RentalDatesScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="RentalStayDetails" component={RentalStayDetailsScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="RentalConfirm" component={guarded.RentalConfirm} options={mainAppScreenOptions} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="BookService" component={guarded.BookService} options={mainAppScreenOptions} />
      <Stack.Screen name="Payment" component={guarded.Payment} options={mainAppScreenOptions} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="AboutDoHuub" component={AboutDoHuubScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="PaymentMethods" component={guarded.PaymentMethods} options={mainAppScreenOptions} />
      <Stack.Screen name="EditPaymentCard" component={guarded.EditPaymentCard} options={mainAppScreenOptions} />
      <Stack.Screen name="SavedAddresses" component={guarded.SavedAddresses} options={mainAppScreenOptions} />
      <Stack.Screen name="AddAddress" component={guarded.AddAddress} options={mainAppScreenOptions} />
      <Stack.Screen name="ReferFriend" component={guarded.ReferFriend} options={mainAppScreenOptions} />
      <Stack.Screen name="RewardsWallet" component={guarded.RewardsWallet} options={mainAppScreenOptions} />
      <Stack.Screen name="PointsHistory" component={guarded.PointsHistory} options={mainAppScreenOptions} />
      <Stack.Screen name="EditProfile" component={guarded.EditProfile} options={mainAppScreenOptions} />
      <Stack.Screen name="BookingDetail" component={guarded.BookingDetail} options={mainAppScreenOptions} />
      <Stack.Screen name="LeaveReview" component={guarded.LeaveReview} options={mainAppScreenOptions} />
    </Stack.Navigator>
  );
}
