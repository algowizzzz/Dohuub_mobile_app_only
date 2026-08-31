import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

export default function DottedBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height}>
        <Defs>
          <Pattern id="vendorDots" patternUnits="userSpaceOnUse" width={16} height={16}>
            <Circle cx={1.5} cy={1.5} r={1.15} fill="rgba(46, 122, 217, 0.16)" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#vendorDots)" />
      </Svg>
    </View>
  );
}