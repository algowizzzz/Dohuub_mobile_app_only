import { Dimensions, PixelRatio } from 'react-native';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

function getWindow() {
  return Dimensions.get('window');
}

export const SCREEN_WIDTH = getWindow().width;
export const SCREEN_HEIGHT = getWindow().height;

export function scaleWidth(size: number) {
  return (getWindow().width / BASE_WIDTH) * size;
}

export function scaleHeight(size: number) {
  return (getWindow().height / BASE_HEIGHT) * size;
}

export function heightPercent(percent: number) {
  return (getWindow().height * percent) / 100;
}

export function widthPercent(percent: number) {
  return (getWindow().width * percent) / 100;
}

export function scaleFont(size: number) {
  const newSize = scaleWidth(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
