import React from 'react';
import { Platform, StatusBar } from 'react-native';

type Props = {
  backgroundColor: string;
  barStyle?: 'light-content' | 'dark-content';
};

export default function ScreenStatusBar({ backgroundColor, barStyle = 'dark-content' }: Props) {
  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
      translucent={false}
    />
  );
}
