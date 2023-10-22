import { Tab, TabGroup } from 'vscode'

// It's a copy of vscode.Tab, but without the `group` property
export interface TabLike extends Exclude<Tab, 'group'> {
  groupIndex: number
}

// it's a copy of vscode.TabGroup, but without the `isActive` and the `viwColumn` properties
export interface TabGroupLike
  extends Pick<TabGroup, 'isActive' | 'viewColumn'> {
  activeTabIndex: number
  tabs: TabLike[]
}

export type BranchName = string

export interface BranchNameTabGroupsMapping {
  branchName: BranchName
  tabGroups: TabGroupLike[]
}

export type ManagedWorkspaceHead = {
  branchName: BranchName
  tabGroups: TabGroupLike[]
}

export type ManagedWorkspaceHistory = Record<BranchName, TabGroupLike[]>

export type ManagedWorkspaceNotification = TabGroupLike[]
