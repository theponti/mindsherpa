import type { components } from '~/utils/api-types'

export type FocusItemInput = components['schemas']['FocusItemInput']

export type FocusItem = components['schemas']['FocusItem']

export type FocusItems = FocusItem[]

export type FocusResponse = {
  items: FocusItems
}
