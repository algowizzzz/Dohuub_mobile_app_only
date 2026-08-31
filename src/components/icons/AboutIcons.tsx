import React from 'react';
import {
  Broom,
  EnvelopeSimple,
  Globe,
  HeartStraight,
  House,
  InstagramLogo,
  Scissors,
  ShoppingCart,
  TiktokLogo,
  Wrench,
} from 'phosphor-react-native';
import { colors } from '../../styles';

type Props = { size?: number; color?: string };

const brand = colors.primary;

export function AboutBroom({ size = 22, color = brand }: Props) {
  return <Broom size={size} color={color} weight="duotone" />;
}

export function AboutWrench({ size = 22, color = brand }: Props) {
  return <Wrench size={size} color={color} weight="duotone" />;
}

export function AboutCart({ size = 22, color = brand }: Props) {
  return <ShoppingCart size={size} color={color} weight="duotone" />;
}

export function AboutScissors({ size = 22, color = brand }: Props) {
  return <Scissors size={size} color={color} weight="duotone" />;
}

export function AboutHouse({ size = 22, color = brand }: Props) {
  return <House size={size} color={color} weight="duotone" />;
}

export function AboutHeart({ size = 22, color = brand }: Props) {
  return <HeartStraight size={size} color={color} weight="duotone" />;
}

export function AboutMail({ size = 22, color = brand }: Props) {
  return <EnvelopeSimple size={size} color={color} weight="regular" />;
}

export function AboutGlobe({ size = 22, color = brand }: Props) {
  return <Globe size={size} color={color} weight="regular" />;
}

export function AboutInstagram({ size = 22, color = brand }: Props) {
  return <InstagramLogo size={size} color={color} weight="regular" />;
}

export function AboutTiktok({ size = 22, color = brand }: Props) {
  return <TiktokLogo size={size} color={color} weight="fill" />;
}
