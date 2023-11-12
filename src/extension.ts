// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import { WorkspaceTabsMananger } from './WorkspaceTabsManager'
import { BranchManager } from './BranchManager'
import { ManagedWorkspaceState } from './ManagedWorkspaceState'
import { TabsHistoryDataProvider } from './views/history-view'
import { treeViewId } from './constants'

let tabManager: WorkspaceTabsMananger | undefined
let managedState: ManagedWorkspaceState | undefined
let reposBranchManager: BranchManager | undefined

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  tabManager = new WorkspaceTabsMananger()
  managedState = new ManagedWorkspaceState(context)
  reposBranchManager = new BranchManager()

  // return managedState.reset()

  reposBranchManager.onDidChangeBranchHead((branchName) => {
    // console.log('------------ onDidChangeBranchHead, branchName: ', branchName)
    if (!tabManager || !managedState) {
      return
    }

    const headTabGroupsMapping = managedState.getActiveWorkspace()

    // if theres no current, we need to initialize it
    if (!headTabGroupsMapping) {
      managedState.changeActiveWorkspace({
        branchName,
        tabGroups: tabManager.getEditorTabGroupsLike(),
      })
      return
    }

    // If theres a `current` but it's not the `branchName`
    if (branchName !== headTabGroupsMapping.branchName) {
      managedState.changeActiveWorkspace({
        branchName,
        tabGroups: tabManager.getEditorTabGroupsLike(),
      })
    }
  })

  tabManager.onDidChangeTabGroups((tabGroups) => {
    if (!tabManager || !managedState) {
      return
    }

    const headTabGroupsMapping = managedState.getActiveWorkspace()

    if (headTabGroupsMapping?.branchName) {
      managedState.updateHistoryWorkspaces({
        branchName: headTabGroupsMapping.branchName,
        tabGroups: tabManager.getEditorTabGroupsLike(),
      })
    }

    managedState.updateActiveWorkspace(tabGroups)
  })

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.clear()
  console.log('-----------------------------------------------------------')
  console.log('Congratulations, your extension "tabularasa" is now active!')

  // const xoxo = async () => {
  //   const response = await vscode.window.showInformationMessage(
  //     'Hello World from tabularasa!',
  //     'ok',
  //     'cancel'
  //   )
  // }

  // xoxo()
  vscode.window.registerTreeDataProvider(
    treeViewId,
    new TabsHistoryDataProvider(managedState)
  )

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'tabularasa.helloWorld',
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      // vscode.window.showInformationMessage("Hello World from tabularasa!")
      const response = await vscode.window.showInformationMessage(
        'Hello World from tabularasa!',
        'ok',
        'cancel'
      )
      console.log('response: ', response)
    }
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {
  reposBranchManager?.dispose()
  tabManager?.dispose()
}
