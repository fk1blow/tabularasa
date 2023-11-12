import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode'
import { ManagedWorkspaceState, TabGroupLike } from '../ManagedWorkspaceState'
import { pluralize, nthize } from '../utils/string'
import { HistoryEntryItem } from './entry-item'
import { TypeKeyForItems } from './types'

export class TabsHistoryDataProvider
  implements TreeDataProvider<HistoryEntryItem>
{
  constructor(private workspaceState: ManagedWorkspaceState) {}

  getTreeItem(element: HistoryEntryItem): TreeItem {
    return element
  }

  getChildren(element?: HistoryEntryItem): Thenable<HistoryEntryItem[]> {
    const workspaceHistory = this.workspaceState.getHistoryWorkspaces()

    if (Object.keys(workspaceHistory).length === 0) {
      window.showInformationMessage(
        "Tabularasa doesn't have any history recorded"
      )
      return Promise.resolve([])
    }

    if (!element) {
      return Promise.resolve(
        Object.keys(workspaceHistory).map((branchName) => {
          const tabGroups: TabGroupLike[] = workspaceHistory[branchName]
          const description = `${pluralize(
            tabGroups,
            'tab group',
            'tab groups'
          )}`
          return new HistoryEntryItem(
            { label: branchName },
            description,
            undefined,
            TreeItemCollapsibleState.Collapsed,
            {
              key: TypeKeyForItems.Root,
              [TypeKeyForItems.TabGroups]: workspaceHistory[branchName],
            }
          )
        })
      )
    }

    if (element.itemWithPathKey?.key === TypeKeyForItems.Root) {
      return Promise.resolve(
        element.itemWithPathKey.tabGroups.map((tabGroup, idx) => {
          const tabsDescriptionCount = `${pluralize(
            tabGroup.tabs,
            'tab',
            'tabs'
          )}`
          const groupDescriptionIsActive = tabGroup.isActive ? ' • active' : ''
          const description = `${tabsDescriptionCount}${groupDescriptionIsActive}`

          return new HistoryEntryItem(
            { label: `${nthize(idx + 1)} group` },
            description,
            undefined,
            TreeItemCollapsibleState.Collapsed,
            {
              key: TypeKeyForItems.TabGroups,
              [TypeKeyForItems.Tabs]: tabGroup.tabs,
            }
          )
        })
      )
    }

    if (element.itemWithPathKey?.key === TypeKeyForItems.TabGroups) {
      return Promise.resolve(
        element.itemWithPathKey.tabs.map((tab, _idx) => {
          return new HistoryEntryItem(
            { label: `${tab.label}` },
            `${tab.isActive ? 'focused' : ''}`,
            tab.resourceUri,
            TreeItemCollapsibleState.None,
            {
              key: TypeKeyForItems.Tabs,
            }
          )
        })
      )
    }

    return Promise.resolve([])
  }
}
