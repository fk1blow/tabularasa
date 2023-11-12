import {
  Disposable,
  EventEmitter,
  TabChangeEvent,
  TabGroup,
  TabInputText,
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
    return tabGroups.map((tabGroup) => {
      return {
        activeTabIndex: 0,
        isActive: tabGroup.isActive,
        tabs: this.transformTabGroupTabs(tabGroup),
        viewColumn: tabGroup.viewColumn,
      }
    })
  }

  private transformTabGroupTabs(tabGroup: TabGroup): TabLike[] {
    return (
      tabGroup.tabs
        .slice()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ group, input, ...rest }) => {
          if (input instanceof TabInputText) {
            return {
              ...rest,
              resourceUri: input.uri,
            }
          }
          return {
            ...rest,
            input,
          }
        }) as TabLike[]
    )
  }
}
