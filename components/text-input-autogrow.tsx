import React, { useRef } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

import { Colors } from '~/utils/styles';

const AutoGrowingInput = ({ onChangeText, placeholder, style, value }: TextInputProps) => {
  const inputRef = useRef(null);

  return (
    <TextInput
      ref={inputRef}
      style={[styles.input, { color: value && value.length > 0 ? Colors.black : Colors.grayLight }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? 'I want to buy a Porsche and a h...'}
      multiline
    />
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingTop: 10,
    paddingBottom: 10,
    color: '#999',
    flexWrap: 'wrap',
  },
});

export default AutoGrowingInput;
