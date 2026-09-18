import React from 'react';
import { Image } from 'react-native';
import { logo } from '../../assets/images';
import { styles } from './AuthLogoMark.styles';

export default function AuthLogoMark() {
  return <Image source={logo} style={styles.logo} resizeMode="contain" />;
}
