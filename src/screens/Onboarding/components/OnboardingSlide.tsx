import React from 'react';
import { Image, Text, View } from 'react-native';
import { SquaresFour, CalendarCheck, ChatCircleDots } from 'phosphor-react-native';
import { iconInfinityWhite } from '../../../assets/images';
import PaginationDots from './PaginationDots';
import { styles } from './OnboardingSlide.styles';

type Props = {
  width: number;
  icon: string;
  title: string;
  description: string;
  slideCount: number;
  activeIndex: number;
};

const PHOSPHOR_ICONS = {
  SquaresFour,
  CalendarCheck,
  ChatCircleDots,
};

export default function OnboardingSlide({
  width,
  icon,
  title,
  description,
  slideCount,
  activeIndex,
}: Props) {
  const PhosphorIcon = PHOSPHOR_ICONS[icon as keyof typeof PHOSPHOR_ICONS];

  return (
    <View style={[styles.slide, { width, height: '100%' }]}>
      <View style={styles.iconWrap}>
        <View style={styles.iconBadge}>
          {icon === 'infinite' ? (
            <Image source={iconInfinityWhite} style={styles.iconImage} resizeMode="contain" />
          ) : (
            <PhosphorIcon size={96} color="#FFFFFF" weight="duotone" />
          )}
        </View>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.paginationRow}>
          <PaginationDots count={slideCount} activeIndex={activeIndex} />
        </View>
      </View>
    </View>
  );
}
