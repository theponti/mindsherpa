import { MoreHorizontal, Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingFull } from '~/components/LoadingFull';
import { ScreenContent } from '~/components/ScreenContent';
import { Card } from '~/components/card';
import { FeedbackBlock } from '~/components/feedback-block';
import { NoteForm } from '~/components/notes/note-form';
import { NoteListItem } from '~/components/notes/note-list-item';
import { ViewHeader } from '~/components/view-header';
import { Text } from '~/theme';
import { NoteOutput } from '~/utils/schema/graphcache';
import { useNotesQuery } from '~/utils/services/notes/Notes.query.generated';
import { Colors } from '~/utils/styles';

const NotebookScreen = () => {
  const [getNotesResponse, getNotes] = useNotesQuery({
    pause: true,
    requestPolicy: 'network-only',
  });
  const notes = getNotesResponse.data?.notes;
  const onFormSubmit = () => {
    getNotes();
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <ScreenContent>
      <ViewHeader />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={styles.container}>
          <View style={styles.header}>
            <Text variant="cardHeader">Notes</Text>
          </View>
          {getNotesResponse.fetching ? <LoadingFull /> : null}
          {!getNotesResponse.fetching && notes ? (
            <View style={{ paddingHorizontal: 12, flex: 1 }}>
              <Card>
                <NotesList notes={[...notes]} />
              </Card>
            </View>
          ) : null}
          {getNotesResponse.error ? (
            <FeedbackBlock>
              <Text>Your notes could not be loaded.</Text>
            </FeedbackBlock>
          ) : null}
          <NoteForm onSubmit={onFormSubmit} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenContent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    <View style={headerButtonStyles.headerIcons}>
      <Text style={headerButtonStyles.iconPlaceholder}>
        <MoreHorizontal size={24} color={Colors.black} />
      </Text>
      <Text style={headerButtonStyles.iconPlaceholder}>
        <Plus size={24} color={Colors.black} />
      </Text>
    </View>
  );
};

const headerButtonStyles = StyleSheet.create({
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 24,
    marginLeft: 20,
  },
});

const NotesList = ({ notes }: { readonly notes: NoteOutput[] }) => {
  if (notes.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 24 }}>
        <Text variant="title">No notes yet.</Text>
        <Text variant="body">You can add notes by typing in the text field below.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      renderItem={({ item }) => <NoteListItem item={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};
