import { StyleSheet, TextInput as RNTextInput, TextInputProps } from 'react-native';

function TextInput({ ...props }: TextInputProps) {
  return <RNTextInput style={[styles.input, props.style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 6,
  },
});

export default TextInput;
