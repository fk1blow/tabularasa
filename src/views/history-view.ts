import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  TreeItemLabel,
  Uri,
  window,
} from 'vscode'
import {
  ManagedWorkspaceState,
  TabGroupLike,
  TabLike,
} from '../ManagedWorkspaceState'
import { pluralize, thize } from '../utils/string'

enum TypeKeyForItems {
  Root = 'root',
  TabGroups = 'tabGroups',
  Tabs = 'tabs',
}

type ItemWithPathKeyForRoot = {
  key: TypeKeyForItems.Root
  [TypeKeyForItems.TabGroups]: TabGroupLike[]
}

type ItemWithPathKeyForTabGroups = {
  key: TypeKeyForItems.TabGroups
  [TypeKeyForItems.Tabs]: TabLike[]
}

type ItemWithPathKey = ItemWithPathKeyForRoot | ItemWithPathKeyForTabGroups

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
            { label: `${thize(idx + 1)} group` },
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
            `${tab.isActive ? 'Focused' : ''}`,
            tab.resourceUri,
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
    public readonly resourceUri: Uri | undefined,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly itemWithPathKey?: ItemWithPathKey
  ) {
    super(label, collapsibleState)
    this.resourceUri = resourceUri
  }
}
