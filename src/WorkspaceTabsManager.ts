import {
  Disposable,
  EventEmitter,
  TabChangeEvent,
  TabGroup,
  window,
} from 'vscode'
import { TabGroupLike, TabLike } from './types'

export class WorkspaceTabsMananger {
  private _onDidChangeTabGroups: EventEmitter<TabGroupLike[]>
  private _onDidChangeTabGroupsDisposable: Disposable

  constructor() {
    this._onDidChangeTabGroups = new EventEmitter<TabGroupLike[]>()

    this._onDidChangeTabGroupsDisposable = window.tabGroups.onDidChangeTabs(
      (_evt: TabChangeEvent) => {
        this._onDidChangeTabGroups.fire(
          this.transformTabGroups(window.tabGroups.all.slice())
        )
      }
    )
  }

  cleanup() {
    this._onDidChangeTabGroupsDisposable.dispose()
  }

  get onDidChangeTabGroups() {
    return this._onDidChangeTabGroups.event
  }

  getEditorTabGroupsLike(): TabGroupLike[] {
    return this.transformTabGroups(window.tabGroups.all.slice())
  }

  private transformTabGroups(tabGroups: TabGroup[]): TabGroupLike[] {
    return tabGroups.map((tabGroup, groupIndex) => {
      return {
        activeTabIndex: 0,
        isActive: tabGroup.isActive,
        tabs: tabGroup.tabs.slice().map(({ group, ...rest }) => ({
          groupIndex,
          ...rest,
        })) as TabLike[],
        viewColumn: tabGroup.viewColumn,
      }
    })
  }
}
