import React from 'react';
import { Gift } from 'phosphor-react-native';

type Props = { size?: number; color?: string };

export default function GiftIcon({ size = 18, color = '#B45309' }: Props) {
  return <Gift size={size} color={color} weight="regular" />;
}
