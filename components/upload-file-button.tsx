import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { type PressableProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const UploadFileButton = ({ style, ...props }: PressableProps) => {
  return (
    <Pressable style={[styles.button]} {...props}>
      <MaterialIcons name="add" size={24} color="black" />
    </Pressable>
  );
};

export const SpeakButton = ({ style, ...props }: PressableProps) => {
  return (
    <Pressable style={[styles.speakButton]} {...props}>
      <MaterialIcons name="mic" size={24} color="black" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(239, 241, 245, 1.00)',
    padding: 8,
    borderRadius: 50,
  },
  speakButton: {
    // backgroundColor: 'rgba(239, 241, 245, 1.00)',
    padding: 8,
    borderRadius: 50,
  },
});
