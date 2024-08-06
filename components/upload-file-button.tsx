import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const UploadFileButton = () => {
  return (
    <TouchableOpacity>
      <MaterialIcons name="attach-file" size={24} color="black" />
    </TouchableOpacity>
  );
};
