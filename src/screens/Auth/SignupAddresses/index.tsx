import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../styles';
import ScreenStatusBar from '../../../components/layout/ScreenStatusBar';
import type { AddressType } from '../../SavedAddresses/addresses';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupAddresses'>;

const ROWS: Array<{ type: AddressType; icon: string; label: string; hint: string }> = [
  { type: 'home', icon: 'home-outline', label: 'Home', hint: 'Add your home address' },
  { type: 'work', icon: 'briefcase-outline', label: 'Work', hint: 'Add your work address' },
  { type: 'other', icon: 'location-outline', label: 'Other', hint: 'Add another location' },
];

export default function SignupAddressesScreen({ navigation }: Props) {
  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Home' } }],
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenStatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <Text style={styles.step}>Step 2 of 2</Text>
      <View style={styles.body}>
        <Text style={styles.title}>Add Your Addresses</Text>
        <Text style={styles.subtitle}>Save time by adding your frequent locations</Text>

        {ROWS.map(row => (
          <TouchableOpacity
            key={row.type}
            style={styles.row}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddAddress', { type: row.type })}
          >
            <View style={styles.rowIcon}>
              <Icon name={row.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowHint}>{row.hint}</Text>
            </View>
            <View style={styles.plus}>
              <Icon name="add" size={18} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={goHome} activeOpacity={0.85}>
          <LinearGradient
            colors={['#4CA6FA', '#1D4ADD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.doneButton}
          >
            <Text style={styles.doneLabel}>Done</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
