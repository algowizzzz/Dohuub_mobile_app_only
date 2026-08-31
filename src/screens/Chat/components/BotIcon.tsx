import React from 'react';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
};

/** The hand-drawn robot glyph from the PWA's (tabs)/chat.tsx, ported verbatim. */
export default function BotIcon({ size = 56, color = '#2E7AD9' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx="12" cy="2" r="1.2" fill={color} />
      <Rect x="3" y="5" width="18" height="13" rx="3" stroke={color} strokeWidth={1.5} />
      <Rect x="7" y="9" width="3.2" height="3.2" rx="0.8" fill={color} />
      <Rect x="13.8" y="9" width="3.2" height="3.2" rx="0.8" fill={color} />
      <Line x1="9" y1="14.5" x2="15" y2="14.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <Line x1="8" y1="18" x2="8" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="16" y1="18" x2="16" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
