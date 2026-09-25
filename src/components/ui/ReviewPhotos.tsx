import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { styles } from './ReviewPhotos.styles';

type ViewerProps = {
  images: string[];
  /** Index to open at; null keeps the viewer closed. */
  index: number | null;
  onClose: () => void;
};

/** Full-screen, swipeable photo viewer on black. */
export function PhotoViewer({ images, index, onClose }: ViewerProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState(0);
  const visible = index != null;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setCurrent(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => setCurrent(index ?? 0)}
      supportedOrientations={['portrait']}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.viewer}>
        {visible ? (
          <FlatList
            data={images}
            keyExtractor={(uri, i) => `${i}-${uri}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={index}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            onMomentumScrollEnd={onScroll}
            renderItem={({ item }) => (
              <View style={[styles.page, { width, height }]}>
                <Image source={{ uri: item }} style={styles.fullImage} resizeMode="contain" />
              </View>
            )}
          />
        ) : null}
        <View style={[styles.topBar, { top: insets.top + 8 }]}>
          <Text style={styles.counter}>
            {images.length > 1 ? `${current + 1} / ${images.length}` : ''}
          </Text>
          <TouchableOpacity
            style={styles.close}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close photo"
            hitSlop={8}
          >
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * A review's attached photos: 64×64 thumbnails with an 8px gap, as in the
 * wireframe. Tapping one opens the full-screen viewer at that photo.
 */
export default function ReviewPhotos({ images }: { images?: string[] | null }) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const photos = (images ?? []).filter(Boolean);
  if (!photos.length) return null;

  return (
    <>
      <View style={styles.row}>
        {photos.map((uri, i) => (
          <TouchableOpacity
            key={`${i}-${uri}`}
            activeOpacity={0.8}
            onPress={() => setOpenAt(i)}
            accessibilityRole="imagebutton"
            accessibilityLabel={`Review photo ${i + 1} of ${photos.length}`}
          >
            <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
      <PhotoViewer images={photos} index={openAt} onClose={() => setOpenAt(null)} />
    </>
  );
}
