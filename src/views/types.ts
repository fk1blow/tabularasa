import { TabGroupLike, TabLike } from '../ManagedWorkspaceState'

export enum TypeKeyForItems {
  Root = 'root',
  TabGroups = 'tabGroups',
  Tabs = 'tabs',
}

export type ItemWithPathKeyForRoot = {
  key: TypeKeyForItems.Root
  [TypeKeyForItems.TabGroups]: TabGroupLike[]
}

export type ItemWithPathKeyForTabGroups = {
  key: TypeKeyForItems.TabGroups
  [TypeKeyForItems.Tabs]: TabLike[]
}

export type ItemWithPathKeyForTab = {
  key: TypeKeyForItems.Tabs
}

export type ItemWithPathKey =
  | ItemWithPathKeyForRoot
  | ItemWithPathKeyForTabGroups
  | ItemWithPathKeyForTab
