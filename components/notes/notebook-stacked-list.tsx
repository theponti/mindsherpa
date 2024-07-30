import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NoteForm } from '~/components/notes/note-form';
import StackedListItem from '~/components/stacked-list-item';
import { Text } from '~/theme';
import { NotebookType } from '~/utils/services/notebooks-service';
import { Colors } from '~/utils/styles';
import { supabase } from '~/utils/supabase';

const NotebookScreen = () => {
  const [notebooks, setNotebooks] = useState<NotebookType[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(notebooks.length - 1);

  const expandCard = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  useEffect(() => {
    const loadNotes = async () => {
      const { data, error } = await supabase.from('notebooks').select('*');

      if (error) {
        console.error(error);
      } else {
        setNotebooks([
          { id: '1', content: 'Personal', expandedIndex: 0 },
          { id: '2', content: 'Work', expandedIndex: 0 },
          { id: '3', content: 'Grocery', expandedIndex: 0 },
          { id: '4', content: 'Side Project', expandedIndex: 0 },
          ...data,
        ]);
      }
    };
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
        <Text style={styles.title}>Notes</Text>
        <View style={styles.headerIcons}>
          <Text style={styles.iconPlaceholder}>•••</Text>
          <Text style={styles.iconPlaceholder}>+</Text>
        </View>
      </View>

      <FlatList
        data={notebooks.map((item, index) => ({ ...item, expandedIndex }))}
        renderItem={({ item, index }) => (
          <StackedListItem
            item={item}
            index={index}
            totalItems={notebooks.length}
            expandCard={expandCard}
            isExpanded={expandedIndex !== null}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <NoteForm onSubmit={() => {}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
