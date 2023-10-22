import { TabGroupLike, TabLike } from '../../types'

export enum TypeKeyForItems {
  Root = 'root',
  TabGroups = 'tabGroups',
  Tabs = 'tabs',
}

export type ItemWithPatKeyForRoot = {
  key: TypeKeyForItems.Root
  [TypeKeyForItems.TabGroups]: TabGroupLike[]
}

export type ItemWithPatKeyForTabGroups = {
  key: TypeKeyForItems.TabGroups
  [TypeKeyForItems.Tabs]: TabLike[]
}
