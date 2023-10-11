import { Tab, TabGroup } from 'vscode'

export interface TabLike extends Exclude<Tab, 'group'> {
  groupIndex: number
}

export interface TabGroupLike
  extends Pick<TabGroup, 'isActive' | 'viewColumn'> {
  activeTabIndex: number
  tabs: TabLike[]
}

export interface BranchAssociatedTabGroups {
  branchName: string
  tabGroups: TabGroupLike[]
}

// TODO should this by renamed to `head`?
export type ManagedWorkspaceCurrent = BranchAssociatedTabGroups | null

export type ManagedWorkspaceHistory = Record<string, TabGroupLike[]>

export type ManagedWorkspaceNotification = TabGroupLike[]

export interface ManagedWorkspace {
  current: ManagedWorkspaceCurrent
  history: ManagedWorkspaceHistory
  notification: ManagedWorkspaceNotification
}
