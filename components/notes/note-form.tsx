import { useCallback, useState } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text, theme } from '~/theme';
import AutoGrowingInput from '../text-input-autogrow';
import AudioRecorder from '../media/audio-recorder';
import {
  type FocusItem,
  type CreateNoteOutput,
  useFocusItemsTextGenerate,
  useFocusItemsCreate,
} from '../media/use-audio-upload';
import { UploadFileButton } from '../upload-file-button';
import { FormSubmitButton } from './note-form-submit-button';
import MindsherpaIcon from '../ui/icon';
import { Pressable } from 'react-native';
import { captureException } from '@sentry/react-native';

type NoteFormProps = {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onSubmit: (data: FocusItem[]) => void;
};
export const NoteForm = (props: NoteFormProps) => {
  const { isRecording, setIsRecording, onSubmit } = props;
  const [content, setContent] = useState('');
  const [focusItems, setFocusItems] = useState<CreateNoteOutput['focus_items']>([]);
  const { mutateAsync: createFocusItems } = useFocusItemsCreate({
    onSuccess: (data) => {
      onSubmit(data);
      console.log({ data });
      setFocusItems((prev) => prev.filter((item) => data.find((f) => f.id === item.id)));
    },
    onError: (error) => {
      // !TODO: Handle error
      console.error('focus_item_create', error);
    },
  });
  const { mutate, isError, isPending } = useFocusItemsTextGenerate({
    onSuccess: (data) => {
      if (data) {
        setFocusItems(data.focus_items);
      }
      setContent('');
    },
    onError: (error) => {
      // !TODO: Handle error
      console.error('Focu items creation', error);
    },
  });

  const onStartRecording = useCallback(() => {
    setIsRecording(true);
  }, [setIsRecording]);

  const onStopRecording = useCallback(
    (data: CreateNoteOutput) => {
      setIsRecording(false);
      setFocusItems(data.focus_items);
    },
    [setIsRecording]
  );

  const onFocusItemPreviewClick = async (focusItem: CreateNoteOutput['focus_items'][0]) => {
    createFocusItems([focusItem]);
  };

  const handleSubmit = () => mutate(content);

  return (
    <View style={[styles.container]}>
      <View style={[{ flex: 1, height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }]} />
      {focusItems.map((item, index) => (
        <FocusItemPreview key={index} focusItem={item} onCreateClick={onFocusItemPreviewClick} />
      ))}
      {!isRecording ? (
        <View style={[styles.inputContainer]}>
          <AutoGrowingInput
            editable={!isRecording && !isPending}
            placeholder="Drop a note..."
            value={content}
            onChangeText={setContent}
          />
        </View>
      ) : null}
      <View style={[styles.actionButtons]}>
        <View style={[styles.mediaButtons]}>
          <UploadFileButton />
          <AudioRecorder onStartRecording={onStartRecording} onStopRecording={onStopRecording} />
        </View>
        <FormSubmitButton
          isRecording={isRecording}
          isLoading={isPending}
          onSubmitButtonClick={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
    borderColor: theme.colors.grayMedium,
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  inputContainer: {},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  mediaButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 16,
    alignSelf: 'flex-start',
    marginRight: 16,
  },
});

type FocusItemPreviewProps = {
  focusItem: CreateNoteOutput['focus_items'][0];
  onCreateClick: (focusItem: CreateNoteOutput['focus_items'][0]) => void;
} & ViewProps;
const FocusItemPreview = ({ focusItem, onCreateClick, ...props }: FocusItemPreviewProps) => {
  const onIconPress = () => {
    onCreateClick(focusItem);
  };
  return (
    <View style={[focusItemStyles.item]} {...props}>
      <View style={[focusItemStyles.info]}>
        <Text variant="body" color="black">
          {focusItem.text}
        </Text>
        {focusItem.due_date ? <Text variant="caption">Due: {focusItem.due_date}</Text> : null}
      </View>
      <Pressable style={[focusItemStyles.icon]} onPress={onIconPress}>
        <MindsherpaIcon name="list-tree" size={24} color={theme.colors.black} />
      </Pressable>
    </View>
  );
};

const focusItemStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: theme.colors.blueLight,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  icon: {
    justifyContent: 'center',
    marginRight: 20,
  },
});
