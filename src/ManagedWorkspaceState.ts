import { ExtensionContext, Tab, TabGroup, Uri } from 'vscode'

enum WorkspaceStateKeys {
  ActiveWorkspace = 'active',
  HistoryWorkspaces = 'history',
  Notification = 'notification',
}

// It's a copy of vscode.Tab, but without the `group` property
export interface TabLike extends Exclude<Tab, 'group'> {
  // groupIndex: number
  resourceUri: Uri
}

// it's a copy of vscode.TabGroup, but without the `isActive` and the `viwColumn` properties
export interface TabGroupLike
  extends Pick<TabGroup, 'isActive' | 'viewColumn'> {
  activeTabIndex: number
  tabs: TabLike[]
}

export interface BranchNameTabGroupsMapping {
  branchName: BranchName
  tabGroups: TabGroupLike[]
}

export type ManagedWorkspaceHead = {
  branchName: BranchName
  tabGroups: TabGroupLike[]
}

export type BranchName = string

export type ManagedWorkspaceHistory = Record<BranchName, TabGroupLike[]>

// This is an interface to vscode.workspaceState, to manage the state of the extension
// and to access different parts of the state, like the current branch, the history, etc.
export class ManagedWorkspaceState {
  constructor(private ctx: ExtensionContext) {
    const headTabGroupsMapping = this.getActiveWorkspace()
    if (!headTabGroupsMapping) {
      console.info('active workspace not initialized!')
    }
    // initialize history as an empty list
    if (!this.ctx.workspaceState.get(WorkspaceStateKeys.HistoryWorkspaces)) {
      console.info('initializing workspace state "history"')
      this.ctx.workspaceState.update(
        WorkspaceStateKeys.HistoryWorkspaces,
        {} as ManagedWorkspaceHistory
      )
    }
  }

  getActiveWorkspace(): ManagedWorkspaceHead | undefined {
    return this.ctx.workspaceState.get(WorkspaceStateKeys.ActiveWorkspace)
  }

  changeActiveWorkspace(value: ManagedWorkspaceHead) {
    this.ctx.workspaceState.update(WorkspaceStateKeys.ActiveWorkspace, value)
  }

  updateActiveWorkspace(tabGroups: TabGroupLike[]) {
    const headTabGroupsMapping = this.getActiveWorkspace()
    if (!headTabGroupsMapping) {
      return
    }
    const update: ManagedWorkspaceHead = {
      branchName: headTabGroupsMapping.branchName,
      tabGroups,
    }
    this.ctx.workspaceState.update(WorkspaceStateKeys.ActiveWorkspace, update)
  }

  getHistoryWorkspaces(): ManagedWorkspaceHistory {
    return (
      this.ctx.workspaceState.get(WorkspaceStateKeys.HistoryWorkspaces) || {}
    )
  }

  // TODO maybe `updateBranchNameHistory` is a better name
  // or just split into `updateHistoryForBranchName` or `addHistoryForBranchName`
  updateHistoryWorkspaces(value: BranchNameTabGroupsMapping) {
    const tabGroupsAreEmpty = value.tabGroups.every((g) => g.tabs.length === 0)
    const history = this.getHistoryWorkspaces()

    // don't save empty tab groups - delete them instead
    if (tabGroupsAreEmpty) {
      delete history[value.branchName]
      this.ctx.workspaceState.update(
        WorkspaceStateKeys.HistoryWorkspaces,
        history
      )
      return
    }

    history[value.branchName] = value.tabGroups.filter((g) => g.tabs.length > 0)
    this.ctx.workspaceState.update(
      WorkspaceStateKeys.HistoryWorkspaces,
      history
    )
  }

  reset() {
    this.ctx.workspaceState.update(
      WorkspaceStateKeys.ActiveWorkspace,
      undefined
    )
    this.ctx.workspaceState.update(
      WorkspaceStateKeys.HistoryWorkspaces,
      undefined
    )
    this.ctx.workspaceState.update(WorkspaceStateKeys.Notification, undefined)
  }
}
