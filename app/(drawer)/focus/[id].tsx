import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import TextInput from '~/components/text-input'
import queryClient from '~/utils/query-client'
import type { FocusItem } from '~/utils/services/notes/types'

export default function FocusItemView() {
  const { id } = useLocalSearchParams()
  const focusItems: FocusItem[] = queryClient.getQueryData(['focusItems']) || []
  const focusItem = focusItems?.find((item) => item.id === Number(id))

  if (!focusItem) {
    return null
  }

  const [name, setName] = useState(focusItem.text || '')

  return (
    <View>
      <View style={{ rowGap: 24, marginTop: 32 }}>
        <View>
          <TextInput
            aria-disabled
            label="Name"
            placeholder="Enter your name"
            value={name}
            style={{ flex: 1 }}
            onChange={(e) => setName(e.nativeEvent.text)}
          />
        </View>
        {/* <DatePickerIOSBase /> */}
      </View>
    </View>
  )
}
