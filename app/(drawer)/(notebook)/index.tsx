import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const expandCard = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const loadNotes = useCallback(async () => {
    const { data, error } = await getNotes();

    if (error) {
      setNotesError(error.message);
    }

    if (data) {
      setNotes([
        { id: data.length + 1, content: 'Personal', expandedIndex: 0 },
        { id: data.length + 2, content: 'Work', expandedIndex: 0 },
        { id: data.length + 3, content: 'Grocery', expandedIndex: 0 },
        { id: data.length + 4, content: 'Side Project', expandedIndex: 0 },
        ...data,
      ]);
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
      <View style={styles.header}>
        <Text variant="header">Notes</Text>
        {/* <View style={styles.headerIcons}>
          <Text style={styles.iconPlaceholder}>•••</Text>
          <Text style={styles.iconPlaceholder}>+</Text>
        </View> */}
      </View>

      <FlatList
        data={notes.map((item, index) => ({ ...item, expandedIndex }))}
        renderItem={({ item, index }) => (
          <NoteListItem key={index} item={item} />
          // <StackedListItem
          //   item={item}
          //   index={index}
          //   totalItems={listItems.length}
          //   expandCard={expandCard}
          //   isExpanded={expandedIndex !== null}
          // />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      {notesError ? (
        <FeedbackBlock>
          <Text>{notesError}</Text>
        </FeedbackBlock>
      ) : null}
      <NoteForm onSubmit={onFormSubmit} />
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
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 24,
    marginLeft: 20,
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
