export type FocusResponse = {
  items: {
    id: number
    type: string
    taskSize: string
    text: string
    category: string
    priority: number
    sentiment: string
    state: string
    dueDate: string
    profileId: string
    createdAt: string
    updatedAt: string
  }[]
}

export type FocusItem = FocusResponse['items'][0]
