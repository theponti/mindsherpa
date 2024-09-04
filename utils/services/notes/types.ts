export type FocusItem = {
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
}

export type FocusItems = FocusItem[]

export type FocusResponse = {
  items: FocusItems
}
