import React from 'react';
import { Image, View } from 'react-native';
import { logo } from '../../assets/images';
import { styles } from './AuthLogoMark.styles';

export default function AuthLogoMark() {
  return (
    <View style={styles.wrap}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}
