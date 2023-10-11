import { ExtensionContext } from 'vscode'
import {
  ManagedWorkspaceCurrent,
  ManagedWorkspaceHistory,
  BranchAssociatedTabGroups,
  TabGroupLike,
  ManagedWorkspaceNotification,
} from './types'

enum StateKeys {
  current = 'current',
  history = 'history',
  notification = 'notification',
}

export class ManagedWorkspaceState {
  constructor(private ctx: ExtensionContext) {
    const current = this.getCurrent()
    if (!current) {
      console.info('"current" key is not initialized!')
    }
    // initialize history as an empty list
    if (!this.ctx.workspaceState.get(StateKeys.history)) {
      console.info('initializing workspace state "history"')
      this.ctx.workspaceState.update(StateKeys.history, new Map())
    }
  }

  // TODO `current` should be renamed b/c reasons
  getCurrent(): ManagedWorkspaceCurrent | undefined {
    return this.ctx.workspaceState.get(StateKeys.current)
  }

  // TODO `current` should be renamed b/c reasons
  changeCurrent(value: BranchAssociatedTabGroups) {
    this.ctx.workspaceState.update(StateKeys.current, value)
  }

  // TODO `current` should be renamed b/c reasons
  updateCurrentTabs(tabGroups: TabGroupLike[]) {
    const current = this.getCurrent()
    if (!current) {
      return
    }
    const update: BranchAssociatedTabGroups = {
      branchName: current.branchName,
      tabGroups,
    }
    this.ctx.workspaceState.update(StateKeys.current, update)
  }

  getHistory(): ManagedWorkspaceHistory {
    return this.ctx.workspaceState.get(StateKeys.history) || {}
  }

  updateHistory(value: BranchAssociatedTabGroups) {
    const history = { ...this.getHistory() }
    history[value.branchName] = value.tabGroups
    this.ctx.workspaceState.update(StateKeys.history, history)
  }

  changeNotification(notification: ManagedWorkspaceNotification) {
    this.ctx.workspaceState.update(StateKeys.notification, notification)
  }

  getNotification(): ManagedWorkspaceNotification | undefined {
    return this.ctx.workspaceState.get(StateKeys.notification)
  }

  reset() {
    this.ctx.workspaceState.update(StateKeys.current, undefined)
    this.ctx.workspaceState.update(StateKeys.history, undefined)
    this.ctx.workspaceState.update(StateKeys.notification, undefined)
  }
}
