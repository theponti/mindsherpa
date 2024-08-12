import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '~/utils/styles';

export const FormSubmitButton = ({
  buttonType,
  disabled,
  isLoading,
  isRecording,
  onStartRecording,
  onStopRecording,
  onSubmitButtonClick,
}: {
  buttonType: 'voice' | 'text';
  disabled: boolean;
  isLoading: boolean;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSubmitButtonClick: () => void;
}) => {
  if (isLoading) {
    return (
      <TouchableOpacity style={[styles.sendButton]} disabled>
        <ActivityIndicator size="small" color="black" />
      </TouchableOpacity>
    );
  }

  if (buttonType === 'voice') {
    if (isRecording) {
      return (
        <TouchableOpacity onPress={onStopRecording} style={[styles.sendButton]} disabled={disabled}>
          <MaterialIcons name="stop" size={24} color="black" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onStartRecording} style={[styles.sendButton]} disabled={disabled}>
        <MaterialIcons name="mic" size={24} color="black" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onSubmitButtonClick} style={[styles.sendButton]}>
      <MaterialIcons name="arrow-upward" size={24} color={Colors.white} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: Colors.blueDark,
    borderRadius: 50,
    padding: 8,
  },
});
