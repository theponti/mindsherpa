import type { components } from '~/utils/api-types'

export type FocusItemInput = components['schemas']['FocusItemBaseV2']

export type FocusItem = components['schemas']['FocusItem']

export type FocusItems = FocusItem[]

export type FocusResponse = {
  items: FocusItems
}
