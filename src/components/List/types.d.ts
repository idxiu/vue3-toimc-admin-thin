import { IconTypes } from '../Icon/types'

export interface MessageListItem {
  avatar?: string
  title?: string
  desc?: string
  time?: string
  tag?: string
  tagType?: BadgeTypes
}

export interface MessageListOptions {
  title: string
  content?: MessageListItem[]
}

export interface ActionOptions {
  title: string
  icon?: IconTypes
}
