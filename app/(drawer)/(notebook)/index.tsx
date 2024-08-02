import { MoreHorizontal, Plus } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeedbackBlock } from '~/components/feedback-block';
import { NoteForm } from '~/components/notes/note-form';
import { NoteListItem } from '~/components/notes/note-list-item';
import { Text } from '~/theme';
import { getNotes, NoteType } from '~/utils/services/notebooks-service';
import { Colors } from '~/utils/styles';
import { supabase } from '~/utils/supabase';

const NotebookScreen = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [notesError, setNotesError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    const { data, error } = await getNotes();

    if (error) {
      setNotesError(error.message);
    }

    if (data) {
      setNotes(data);
    }
  }, []);

  const onFormSubmit = async (content: string) => {
    loadNotes();
  };

  useEffect(() => {
    const subscription = supabase
      .channel('notes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
        console.log(payload);
      });

    loadNotes();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.container}>
        <View style={styles.header}>
          <Text variant="header">Notes</Text>
          <HeaderButtons />
        </View>

        <FlatList
          data={notes}
          renderItem={({ item, index }) => <NoteListItem key={index} item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
        {notesError ? (
          <FeedbackBlock>
            <Text>{notesError}</Text>
          </FeedbackBlock>
        ) : null}
        <NoteForm onSubmit={onFormSubmit} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotebookScreen;

const HeaderButtons = () => {
  return (
    <View style={headerButttonStyles.headerIcons}>
      <Text style={headerButttonStyles.iconPlaceholder}>
        <MoreHorizontal size={24} color={Colors.black} />
      </Text>
      <Text style={headerButttonStyles.iconPlaceholder}>
        <Plus size={24} color={Colors.black} />
      </Text>
    </View>
  );
};

const headerButttonStyles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 24,
    marginLeft: 20,
  },
});
