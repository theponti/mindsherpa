import { Mic, Notebook, Send } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import TextInput from '~/components/text-input';
import { Colors } from '~/utils/styles';
import { supabase } from '~/utils/supabase';

export const NoteForm = ({ onSubmit }: { onSubmit: (note: any) => void }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const { data, error } = await supabase.from('notes').insert({ content });

    if (error) {
      console.error(error);
    } else {
      onSubmit(data);
      setContent('');
    }
  };

  return (
    <View style={styles.noteSection}>
      <TouchableOpacity style={styles.noteButton}>
        <Notebook color={Colors.black} size={20} />
        <TextInput
          style={[styles.noteText, { color: content.length > 0 ? Colors.black : Colors.grayLight }]}
          placeholder="Drop a note..."
          value={content}
          onChangeText={setContent}
        />
      </TouchableOpacity>

      {content.length > 0 ? (
        <TouchableOpacity onPress={handleSubmit} style={styles.sendButton}>
          <Send color={Colors.white} size={20} />
        </TouchableOpacity>
      ) : (
        <Mic color={Colors.black} size={20} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noteSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 20,
  },
  noteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  noteText: {
    marginLeft: 8,
    color: '#999',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
    height: 32,
    width: 45,
    borderRadius: 20,
  },
});
