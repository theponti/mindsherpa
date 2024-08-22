import { MaterialIcons } from '@expo/vector-icons';
import { captureException } from '@sentry/react-native';
import { Audio } from 'expo-av';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Pressable,
  type PressableProps,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { type CreateNoteOutput, useAudioUpload } from '~/components/media/use-audio-upload';
import { theme } from '~/theme';
import type { Recordings } from './recordings-list';

type RecordingSuccessResponse = CreateNoteOutput | null;
export default function AudioRecorder({
  multi,
  onStartRecording,
  onStopRecording,
  style,
  ...props
}: PressableProps & {
  multi?: boolean;
  onStartRecording: () => void;
  onStopRecording: (note: CreateNoteOutput | null) => void;
}) {
  const [recording, setRecording] = useState<Audio.Recording>();
  const [meterings, setMeterings] = useState<number[]>([]);
  const [recordingStatus, setRecordingStatus] = useState<Audio.RecordingStatus>();
  const [recordings, setRecordings] = useState<Recordings>([]);
  const { mutate, isPending } = useAudioUpload({
    onSuccess: (data: CreateNoteOutput | null) => {
      onStopRecording(data);
      setRecording(undefined); // Clear recording
      setMeterings([]); // Clear meterings
    },
    onError: () => {
      Alert.alert('Your voice note failed to upload. Try again later.');
      /**
       * The product should retain the recording so the user can attempt to upload
       * it again. If the user choses not to retry, they can clear the input.
       */
      setRecordingStatus(undefined); // Clear recording status
    },
  });

  const onRecordingStatusChange = (status: Audio.RecordingStatus) => {
    setRecordingStatus(status);
    const { metering } = status;
    const positiveMetering = metering ? +metering : 0;
    if (status.isRecording && positiveMetering) {
      setMeterings((current) => [...current, positiveMetering]);
    }
  };

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        recording.setOnRecordingStatusUpdate(onRecordingStatusChange);
        setRecording(recording);
        onStartRecording();
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    /**
     * This function error is caught because the user may possibly quick-click
     * the stop button, causing the following to occuring after the recording has already stopped.
     */
    await recording.stopAndUnloadAsync().catch((reason) => {
      captureException(reason);
    });

    const file = recording.getURI();

    if (multi) {
      const updatedRecordings = [...recordings];
      const { sound } = await recording.createNewLoadedSoundAsync();
      updatedRecordings.push({
        sound: sound,
        duration: recordingStatus?.durationMillis,
        file,
      });
      setRecordings(updatedRecordings);
    }

    if (file) {
      mutate(file);
    }
  }

  const backgroundColor = useSharedValue(0);
  const speakButtonBackground = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      backgroundColor.value,
      [0, 1],
      [theme.colors.grayLight, theme.colors.red]
    ),
  }));

  useEffect(() => {
    backgroundColor.value = recordingStatus?.isRecording ? withSpring(1) : withSpring(0);
  }, [recordingStatus?.isRecording]);

  return (
    <AnimatedPressable
      disabled={isPending}
      style={[pressableStyles.speakButton, speakButtonBackground]}
      onPress={recording ? stopRecording : startRecording}
      {...props}>
      {isPending ? <ActivityIndicator size="small" color={theme.colors.primary} /> : null}
      {!isPending && recordingStatus?.isRecording ? (
        <MaterialIcons name="stop" size={24} color={theme.colors.grayLight} />
      ) : null}
      {!isPending && !recordingStatus?.isRecording ? (
        <MaterialIcons name="mic" size={24} color={theme.colors.primary} />
      ) : null}
    </AnimatedPressable>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const pressableStyles = StyleSheet.create({
  speakButton: {
    padding: 8,
    borderRadius: 50,
  },
});

const Meterings = ({ meterings }: { meterings: number[] }) => {
  if (meterings.length === 0) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', height: 50, backgroundColor: 'gray' }}>
      {meterings.map((meter, index) => (
        <View key={meter} style={{ width: 3, height: meter, backgroundColor: 'black' }} />
      ))}
    </View>
  );
};
