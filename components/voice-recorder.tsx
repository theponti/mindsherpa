import { scaleLinear } from 'd3-scale';
import { Audio } from 'expo-av';
import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useAuth } from '~/utils/auth/auth-context';
import { supabase } from '~/utils/supabase';

export const useVoiceRecorder = ({
  onRecordingComplete,
}: {
  onRecordingComplete: (uri: string) => void;
}) => {
  const { session } = useAuth();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<Audio.RecordingStatus | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [soundURI, setSoundURI] = useState<string | null>(null);

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

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (!uri) return;
    // ! TODO: handle no URI value

    setSoundURI(uri);
    onRecordingComplete(uri);
  };

  return {
    isRecording,
    recording,
    recordingStatus,
    soundURI,
    startRecording,
    stopRecording,
  };
};

export const VoiceRecorder = ({
  level,
  recording,
  soundURI,
  startRecording,
  stopRecording,
}: {
  level?: number;
  recording: boolean;
  soundURI: string | null;
  startRecording: () => void;
  stopRecording: () => void;
}) => {
  const circleScale = scaleLinear().domain([-160, 0]).range([0, 100]);

  return (
    <View style={styles.container}>
      <Svg height="200" width="200">
        <Circle
          cx="100"
          cy="100"
          r={circleScale(level ?? 0)}
          stroke="black"
          strokeWidth="2.5"
          fill="red"
        />
      </Svg>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {soundURI && <Text>Recording saved at: {soundURI}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
