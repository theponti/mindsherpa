import { MaterialIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { View, StyleSheet, Pressable, PressableProps, Alert } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import React, { useEffect, useState } from 'react'

import { useAudioUpload } from '~/components/media/use-audio-upload'
import { Colors } from '~/utils/styles'
import { Recordings } from './recordings-list'

export default function AudioRecorder({
  multi,
  onStartRecording,
  onStopRecording,
  style,
  ...props
}: PressableProps & {
  multi?: boolean
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
      setRecording(undefined) // Clear recording
      setRecordingStatus(undefined) // Clear recording status
      setMeterings([]) // Clear meterings
    },
    onError: () => {
      Alert.alert('Your voice note failed to upload. Try again later.')
      /**
       * The product should retain the recording so the user can attempt to upload
       * it again. If the user choses not to retry, they can clear the input.
       */
      setRecordingStatus(undefined) // Clear recording status
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

    await recording.stopAndUnloadAsync()
    const file = recording.getURI()

    if (multi) {
      let updatedRecordings = [...recordings]
      const { sound } = await recording.createNewLoadedSoundAsync()
      updatedRecordings.push({
        sound: sound,
        duration: recordingStatus?.durationMillis,
        file,
      })
      setRecordings(updatedRecordings)
    }
    onStartRecording()

    if (file) {
      mutate(file)
    }
  }

  const backgroundColor = useSharedValue(Colors.grayLight)
  const speakButtonBackground = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }))

  useEffect(() => {
    backgroundColor.value = withSpring(recording ? Colors.grayDark : Colors.grayLight, {
      duration: 400,
    })
  }, [recording])

  return (
    <AnimatedPressable
      style={[pressableStyles.speakButton, speakButtonBackground]}
      onPress={recording ? stopRecording : startRecording}
      {...props}
    >
      {recording ? (
        <MaterialIcons name="stop" size={24} color={Colors.grayLight} />
      ) : (
        <MaterialIcons name="mic" size={24} color={Colors.primary} />
      )}
    </AnimatedPressable>
  )
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const pressableStyles = StyleSheet.create({
  speakButton: {
    padding: 8,
    borderRadius: 50,
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
