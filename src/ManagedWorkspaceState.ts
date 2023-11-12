import { ExtensionContext } from 'vscode'
import {
  ManagedWorkspaceHead,
  ManagedWorkspaceHistory,
  BranchNameTabGroupsMapping,
  TabGroupLike,
} from './types'

enum WorkspaceStateKeys {
  ActiveWorkspace = 'active',
  HistoryWorkspaces = 'history',
  Notification = 'notification',
}

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
    const history = { ...this.getHistoryWorkspaces() }
    history[value.branchName] = value.tabGroups
    this.ctx.workspaceState.update(WorkspaceStateKeys.HistoryWorkspaces, history)
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
