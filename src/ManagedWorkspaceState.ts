import { ExtensionContext } from 'vscode'
import {
  ManagedWorkspace,
  HistoryManagedWorkspace,
} from './branch-manager/types'

export class ManagedWorkspaceState {
  constructor(private ctx: ExtensionContext) {}

  getCurrent(): ManagedWorkspace {
    return (
      this.ctx.workspaceState.get('current') ||
      ({ repositories: [], tabGroups: [] } as ManagedWorkspace)
    )
  }

  setCurrent(value: ManagedWorkspace) {
    this.ctx.workspaceState.update('current', value)
  }

  getHistory(): HistoryManagedWorkspace {
    return this.ctx.workspaceState.get('history') || []
  }

  setHistory(value: ManagedWorkspace) {
    this.ctx.workspaceState.update('history', [value, ...this.getHistory()])
  }
}
