import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import React, { useState } from 'react'
import { View, Button, StyleSheet, Alert } from 'react-native'
import Animated, { useSharedValue, useAnimatedProps } from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

import { useUploadVoiceNoteMutation } from '~/utils/services/media/UploadVoiceNote.mutation.generated'

export const useVoiceRecorder = ({
  onRecordingComplete,
}: {
  onRecordingComplete: (uri: string) => void
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [recordingStatus, setRecordingStatus] = useState<Audio.RecordingStatus | null>(null)
  const [uploadVoiceNoteResponse, uploadVoiceNote] = useUploadVoiceNoteMutation()

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync()
      if (permission.status !== 'granted') {
        throw new Error('Permission to access microphone is required!')
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await recording.startAsync()
      setRecording(recording)
      recording.setOnRecordingStatusUpdate((status) => {
        setRecordingStatus(status)
      })
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  const stopRecording = async () => {
    if (!recording) return

    try {
      // 👇 Stop recording
      // setRecording(null);
      await recording.stopAndUnloadAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      })

      // 👇 Get the URI of the recording
      const uri = recording.getURI()
      if (!uri) {
        throw new Error('Failed to get the URI of the recording')
      }

      // 👇 Log file information
      // const fileInfo = await FileSystem.getInfoAsync(uri);

      // 👇 Read the file content as base64
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // 👇 Create a Blob from the base64 content
      const blob = new Blob([fileContent], { type: 'audio/m4a' })

      // 👇 Upload the voice note
      const { data, error } = await uploadVoiceNote({
        audioFile: blob,
      })

      if (error) {
        console.error('Error uploading recording: ', error)
      } else {
        console.log('Recording uploaded: ', data)
      }

      onRecordingComplete(uri)
    } catch (err) {
      console.error('Failed to start recording', err)
      Alert.alert('Failed to stop recording')
    } finally {
      setRecording(null)
      setRecordingStatus(null)
    }
  }

  return {
    isRecording: recordingStatus?.isRecording,
    recording,
    recordingStatus,
    startRecording,
    stopRecording,
    saveRecordingResponse: uploadVoiceNoteResponse,
  }
}

export const VoiceRecorder = ({
  level = 100,
  recording,
  startRecording,
  stopRecording,
}: {
  level?: number
  recording: boolean
  startRecording: () => void
  stopRecording: () => void
}) => {
  return (
    <View style={styles.container}>
      <WavyLine height={100} width={250} level={level} />

      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const AnimatedPath = Animated.createAnimatedComponent(Path)

const WavyLine = ({ width, height, level }: { width: number; height: number; level: number }) => {
  const amplitude = useSharedValue((height * level) / 2)
  const wavelength = width / 4
  const numPoints = 20

  const animatedProps = useAnimatedProps(() => {
    const points = []
    for (let i = 0; i <= numPoints; i++) {
      const x = (i * width) / numPoints
      const y = height / 2 + amplitude.value * Math.sin((2 * Math.PI * x) / wavelength)
      points.push([x, y])
    }

    let d = `M ${points[0][0]},${points[0][1]}`
    for (let i = 1; i < points.length; i++) {
      d += ` C ${points[i - 1][0] + wavelength / 4},${points[i - 1][1]} ${points[i][0] - wavelength / 4},${points[i][1]} ${points[i][0]},${points[i][1]}`
    }

    return { d }
  })

  return (
    <Svg width={width} height={height}>
      <AnimatedPath animatedProps={animatedProps} stroke="black" strokeWidth="2.5" fill="none" />
    </Svg>
  )
}

export default WavyLine
