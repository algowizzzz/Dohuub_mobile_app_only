import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import ScreenStatusBar from './ScreenStatusBar';
import { colors } from '../../styles';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  edges?: Edge[];
};

export default function MainScreenLayout({
  children,
  backgroundColor = colors.background,
  edges = ['top'],
}: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <ScreenStatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <View style={[styles.content, { backgroundColor }]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
});
