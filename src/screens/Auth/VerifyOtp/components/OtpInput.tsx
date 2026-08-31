import React, { useRef } from 'react';
import { NativeSyntheticEvent, Text, TextInput, TextInputKeyPressEventData, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from './OtpInput.styles';

const CODE_LENGTH = 6;

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export default function OtpInput({ value, onChange }: Props) {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const focusIndex = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChangeText = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < CODE_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      focusIndex(index - 1);
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: CODE_LENGTH }).map((_, index) => (
        <TouchableWithoutFeedback key={index} onPress={() => focusIndex(index)}>
          <View style={[styles.box, value[index] && styles.boxFilled]}>
            <Text style={styles.digit}>{value[index] || ''}</Text>
            <TextInput
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              style={styles.hiddenInput}
              value={value[index] || ''}
              onChangeText={text => handleChangeText(text, index)}
              onKeyPress={event => handleKeyPress(event, index)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
            />
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
}

export { CODE_LENGTH };
