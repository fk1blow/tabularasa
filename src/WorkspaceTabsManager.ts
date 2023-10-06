import {
  ExtensionContext,
  Memento,
  TabChangeEvent,
  TabGroup,
  window,
} from 'vscode'

export class WorkspaceTabsMananger {
  constructor(private ctx: ExtensionContext) {
    // console.log('ctx.workspaceState: ', ctx.workspaceState.keys())
    // window.tabGroups.onDidChangeTabs((evt: TabChangeEvent) => {
    //   console.log('---tabs changed')
    //   const tabGroups = window.tabGroups.all
    // })
    // this.persistTabGroups(window.tabGroups.all.slice())
  }

  // private modify() {
  //   const tabGroups = window.tabGroups.all
  //   console.log('tabGroups: ', tabGroups)
  // }

  private persistTabGroups(groups: TabGroup[]) {
    // this.storage.update('tabularasa:master', { tabGroups: groups })
  }
}
