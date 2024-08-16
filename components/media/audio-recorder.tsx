import { MaterialIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { View, Button, Text, StyleSheet, Pressable, PressableProps } from 'react-native'
import React, { useState } from 'react'

import { useAudioUpload } from '~/components/media/use-audio-upload'

type Recording = {
  sound: Audio.Sound
  duration: number | undefined
  file: string | null
}
type Recordings = Recording[]

export default function AudioRecorder({
  onStartRecording,
  onStopRecording,
  style,
  ...props
}: PressableProps & {
  onStartRecording: () => void
  onStopRecording: (note: any) => void
}) {
  const [recording, setRecording] = useState<Audio.Recording>()
  const [meterings, setMeterings] = useState<number[]>([])
  const [recordingStatus, setRecordingStatus] = useState<Audio.RecordingStatus>()
  const [recordings, setRecordings] = useState<Recordings>([])
  const { mutate } = useAudioUpload({
    onSuccess: (data: any) => {
      onStopRecording(data)
    },
    onError: () => {
      console.log('Audio upload failed')
    },
  })

  const onRecordingStatusChange = (status: Audio.RecordingStatus) => {
    setRecordingStatus(status)
    const { metering } = status
    const positiveMetering = metering ? +metering : 0
    if (status.isRecording && positiveMetering) {
      setMeterings((current) => [...current, positiveMetering])
    }
  }

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync()
      if (perm.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        })
        const { recording, status } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        )

        recording.setOnRecordingStatusUpdate(onRecordingStatusChange)
        setRecording(recording)
        onStartRecording()
      }
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    if (!recording) return

    setRecording(undefined) // Clear recording
    setRecordingStatus(undefined) // Clear recording status
    setMeterings([]) // Clear meterings

    await recording.stopAndUnloadAsync()
    const file = recording.getURI()
    let updatedRecordings = [...recordings]
    const { sound } = await recording.createNewLoadedSoundAsync()
    updatedRecordings.push({
      sound: sound,
      duration: recordingStatus?.durationMillis,
      file,
    })
    setRecordings(updatedRecordings)
    onStartRecording()

    if (file) {
      mutate(file)
    }
  }

  return (
    <Pressable
      style={[styles.speakButton]}
      {...props}
      onPress={recording ? stopRecording : startRecording}
    >
      {recording ? (
        <MaterialIcons name="stop" size={24} color="black" />
      ) : (
        <MaterialIcons name="mic" size={24} color="black" />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    // height: 100,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakButton: {
    backgroundColor: 'rgba(239, 241, 245, 1.00)',
    padding: 8,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
    color: 'blue',
  },
})

const Meterings = ({ meterings }: { meterings: number[] }) => {
  if (meterings.length === 0) {
    return null
  }

  return (
    <View style={{ flexDirection: 'row', height: 50, backgroundColor: 'gray' }}>
      {meterings.map((meter, index) => (
        <View key={index} style={{ width: 3, height: meter, backgroundColor: 'black' }} />
      ))}
    </View>
  )
}

const RecordingLines = ({
  recordings,
  onRecordingLineSendClick,
}: { recordings: any[]; onRecordingLineSendClick: (file: string | null) => void }) => {
  if (recordings.length === 0) {
    return null
  }

  function getDurationFormatted(milliseconds: number | undefined) {
    if (!milliseconds) return '0:00'
    const minutes = milliseconds / 1000 / 60
    const minutesDisplay = Math.floor(minutes)
    const seconds = Math.round((minutes - minutesDisplay) * 60)
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds
    return `${minutesDisplay}:${secondsDisplay}`
  }

  return (
    <View>
      {recordings.map((recording, index) => {
        return (
          <View key={index} style={styles.row}>
            <Text style={styles.fill}>
              Recording {index + 1} - {recording.duration}
            </Text>
            <Button onPress={() => recording.sound.replayAsync()} title="Play" />
            <Button onPress={() => onRecordingLineSendClick(recording.file)} title="Send" />
          </View>
        )
      })}
    </View>
  )
}
