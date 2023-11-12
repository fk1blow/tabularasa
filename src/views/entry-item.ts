import { TreeItem, TreeItemCollapsibleState, TreeItemLabel, Uri } from 'vscode'
import { ItemWithPathKey, TypeKeyForItems } from './types'
import { treeViewId } from '../constants'

export enum ContextViewItemType {
  Branch = `${treeViewId}:branch`,
  TabGroup = `${treeViewId}:tabGroup`,
}

export class HistoryEntryItem extends TreeItem {
  constructor(
    public readonly label: TreeItemLabel,
    public readonly description: string,
    public readonly resourceUri: Uri | undefined,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly itemWithPathKey: ItemWithPathKey
  ) {
    super(label, collapsibleState)
    this.resourceUri = resourceUri

    if (itemWithPathKey.key === TypeKeyForItems.Root) {
      this.contextValue = ContextViewItemType.Branch
    } else if (itemWithPathKey.key === TypeKeyForItems.TabGroups) {
      this.contextValue = ContextViewItemType.TabGroup
    }
  }
}
