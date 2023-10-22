import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  TreeItemLabel,
  window,
} from 'vscode'
import { ManagedWorkspaceState } from '../../ManagedWorkspaceState'
import {
  TypeKeyForItems,
  ItemWithPatKeyForRoot,
  ItemWithPatKeyForTabGroups,
} from './types'

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
          return new HistoryEntryItem(
            { label: branchName },
            '',
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
          return new HistoryEntryItem(
            { label: `${idx}` },
            `${
              tabGroup.tabs.length < 1
                ? 'Empty group'
                : tabGroup.isActive
                ? 'Focused'
                : ''
            }`,
            TreeItemCollapsibleState.Collapsed,
            {
              key: TypeKeyForItems.TabGroups,
              [TypeKeyForItems.Tabs]: tabGroup.tabs,
            }
          )
        })
      )
    } else if (element.itemWithPathKey?.key === TypeKeyForItems.TabGroups) {
      return Promise.resolve(
        element.itemWithPathKey.tabs.map((tab, _idx) => {
          return new HistoryEntryItem(
            { label: `${tab.label}` },
            `${tab.isActive ? 'Focused' : ''}`,
            TreeItemCollapsibleState.None
          )
        })
      )
    }

    return Promise.resolve([])
  }
}

export class HistoryEntryItem extends TreeItem {
  constructor(
    public readonly label: TreeItemLabel,
    public readonly description: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly itemWithPathKey?:
      | ItemWithPatKeyForRoot
      | ItemWithPatKeyForTabGroups
  ) {
    super(label, collapsibleState)
  }
}
