import { IconProps } from '../Input/types'

export interface DropMenuItem {
  click?: (T: DropMenuItem, U: number) => void
  //  to?: string
  icon?: string
  value: string | number
  text: string
  disabled?: boolean
  divider?: boolean
  iconProps?: IconProps
}

export type DropMenuPlacementType =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
