import { Audio } from 'expo-av';
import React, { useState, useCallback } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useClient } from 'urql';

import { useUploadVoiceNoteMutation } from '~/utils/services/media/UploadVoiceNote.mutation.generated';

export const useVoiceRecorder = ({
  onRecordingComplete,
}: {
  onRecordingComplete: (uri: string) => void;
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<Audio.RecordingStatus | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const client = useClient();
  const [uploadVoiceNoteResponse, uploadVoiceNote] = useUploadVoiceNoteMutation();

  const saveRecording = useCallback(
    async (uri: string) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const { data, error } = await uploadVoiceNote({
        audioFile: blob,
      });

      if (error) {
        console.error('Error uploading recording: ', error);
      } else {
        console.log('Recording uploaded: ', data);
      }
    },
    [client]
  );
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        setIsRecording(true);
        const { recording, status } = await Audio.Recording.createAsync({
          ios: {
            audioQuality: Audio.IOSAudioQuality.HIGH,
            bitRate: 128000,
            sampleRate: 44100,
            numberOfChannels: 1,
            extension: '.wav',
          },
          android: {
            extension: '.wav',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {
            mimeType: 'audio/wav',
          },
        });

        setRecording(recording);
        setRecordingStatus(status);
      } else {
        alert('Permission to access microphone is required!');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (!uri) {
        throw new Error('Failed to get recording URI');
      }

      // Save the recording to database
      await saveRecording(uri);

      onRecordingComplete(uri);
    } catch (err) {
      Alert.alert('Failed to stop recording');
    } finally {
      setIsRecording(false);
      setRecording(null);
      setRecordingStatus(null);
    }
  };

  return {
    isRecording,
    recording,
    recordingStatus,
    startRecording,
    stopRecording,
    saveRecording,
    saveRecordingResponse: uploadVoiceNoteResponse,
  };
};

export const VoiceRecorder = ({
  level = 100,
  recording,
  startRecording,
  stopRecording,
}: {
  level?: number;
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}) => {
  return (
    <View style={styles.container}>
      <WavyLine height={100} width={250} level={level} />

      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const AnimatedPath = Animated.createAnimatedComponent(Path);

const WavyLine = ({ width, height, level }: { width: number; height: number; level: number }) => {
  const amplitude = useSharedValue((height * level) / 2);
  const wavelength = width / 4;
  const numPoints = 20;

  const animatedProps = useAnimatedProps(() => {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i * width) / numPoints;
      const y = height / 2 + amplitude.value * Math.sin((2 * Math.PI * x) / wavelength);
      points.push([x, y]);
    }

    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      d += ` C ${points[i - 1][0] + wavelength / 4},${points[i - 1][1]} ${points[i][0] - wavelength / 4},${points[i][1]} ${points[i][0]},${points[i][1]}`;
    }

    return { d };
  });

  return (
    <Svg width={width} height={height}>
      <AnimatedPath animatedProps={animatedProps} stroke="black" strokeWidth="2.5" fill="none" />
    </Svg>
  );
};

export default WavyLine;
