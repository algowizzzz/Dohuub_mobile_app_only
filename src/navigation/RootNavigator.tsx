import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
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
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="Services" component={ServicesScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="VendorStore" component={VendorStoreScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="Vendor" component={VendorScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="VendorReviews" component={VendorReviewsScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="BookService" component={BookServiceScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="AboutDoHuub" component={AboutDoHuubScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="EditPaymentCard" component={EditPaymentCardScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="ReferFriend" component={ReferFriendScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="RewardsWallet" component={RewardsWalletScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="PointsHistory" component={PointsHistoryScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={mainAppScreenOptions} />
      <Stack.Screen name="LeaveReview" component={LeaveReviewScreen} options={mainAppScreenOptions} />
    </Stack.Navigator>
  );
}
