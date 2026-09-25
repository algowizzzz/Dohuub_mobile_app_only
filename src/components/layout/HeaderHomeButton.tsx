import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { House } from 'lucide-react-native';
import { colors } from '../../styles';

type Props = {
  testID?: string;
};

/** Header shortcut that drops the whole stack and lands on the Home tab. */
export default function HeaderHomeButton({ testID = 'header-home-button' }: Props) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Go to home"
      style={styles.button}
      hitSlop={8}
      onPress={() =>
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Main', params: { screen: 'Home' } }],
          }),
        )
      }
    >
      <House size={22} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
