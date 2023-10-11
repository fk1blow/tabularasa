import {
  EventEmitter,
  ExtensionContext,
  TabChangeEvent,
  TabGroup,
  window,
} from 'vscode'
import { TabGroupLike, TabLike } from './types'

export class WorkspaceTabsMananger {
  private _onDidChangeTabGroups: EventEmitter<TabGroupLike[]>

  constructor(private ctx: ExtensionContext) {
    this._onDidChangeTabGroups = new EventEmitter<TabGroupLike[]>()

    window.tabGroups.onDidChangeTabs((evt: TabChangeEvent) => {
      this._onDidChangeTabGroups.fire(
        this.transformTabGroups(window.tabGroups.all.slice())
      )
    })
  }

  get onDidChangeTabGroups() {
    return this._onDidChangeTabGroups.event
  }

  getEditorTabGroups(): TabGroupLike[] {
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
