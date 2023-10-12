import { Tab, TabGroup } from 'vscode'

export interface TabLike extends Exclude<Tab, 'group'> {
  groupIndex: number
}

export interface TabGroupLike
  extends Pick<TabGroup, 'isActive' | 'viewColumn'> {
  activeTabIndex: number
  tabs: TabLike[]
}

export type BranchName = string

export interface BranchHeadTabGroupsMapping {
  branchName: BranchName
  tabGroups: TabGroupLike[]
}

export type ManagedWorkspaceHead = {
  branchName: BranchName
  tabGroups: TabGroupLike[]
}

export type ManagedWorkspaceHistory = Record<BranchName, TabGroupLike[]>

export type ManagedWorkspaceNotification = TabGroupLike[]
