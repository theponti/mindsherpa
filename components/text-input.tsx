import { TextInput as RNTextInput, StyleSheet, View, type TextInputProps } from 'react-native'
import { Text, theme } from '~/theme'

function TextInput({ label, style, ...props }: TextInputProps & { label?: string }) {
  if (label) {
    return (
      <View style={{ flexDirection: 'row', rowGap: 8, alignItems: 'center' }}>
        <Text variant="body" color="secondary" style={{ paddingHorizontal: 12 }}>
          {label}
        </Text>
        <RNTextInput
          style={[styles.input, style]}
          placeholder={label}
          accessibilityLabel={label}
          {...props}
        />
      </View>
    )
  }

  return <RNTextInput style={[styles.input, style]} {...props} />
}

const styles = StyleSheet.create({
  input: {
    textAlign: 'right',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    fontSize: 16,
    color: theme.colors.quaternary,
  },
})

export default TextInput
