import React, { useRef } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

import { theme } from '~/theme';

const AutoGrowingInput = ({
  editable,
  onChangeText,
  placeholder,
  value,
  ...props
}: TextInputProps) => {
  const inputRef = useRef(null);

  return (
    <TextInput
      ref={inputRef}
      style={[
        styles.input,
        { color: value && value.length > 0 ? theme.colors.black : theme.colors.grayLight },
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder ?? 'I want to buy a Porsche and a h...'}
      multiline
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    alignSelf: 'stretch',
    fontSize: 20,
    paddingVertical: 16,
    flexWrap: 'wrap',
  },
});

export default AutoGrowingInput;
