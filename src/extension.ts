// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import { WorkspaceTabsMananger } from './WorkspaceTabsManager'
import { BranchManager } from './BranchManager'
import { ManagedWorkspaceState } from './ManagedWorkspaceState'

let tabManager: WorkspaceTabsMananger | undefined
let managedState: ManagedWorkspaceState | undefined
let reposBranchManager: BranchManager | undefined

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  tabManager = new WorkspaceTabsMananger()
  managedState = new ManagedWorkspaceState(context)
  reposBranchManager = new BranchManager()

  // managedState.reset()

  reposBranchManager.onDidChangeBranchHead((branchName) => {
    if (!tabManager || !managedState || !reposBranchManager) {
      return
    }

    const headTabGroupsMapping = managedState.getHead()
    // return

    // if theres no current, we need to initialize it
    if (!headTabGroupsMapping) {
      managedState.changeHead({
        branchName,
        tabGroups: tabManager.getEditorTabGroups(),
      })
      return
    }

    // If theres a `current` but it's not the `branchName`
    if (branchName !== headTabGroupsMapping.branchName) {
      // if the new branch is already in history,
      // change the notification
      const history = managedState.getHistory()
      if (history[branchName]) {
        managedState.changeNotification(history[branchName])
      }

      managedState.changeHead({
        branchName,
        tabGroups: tabManager.getEditorTabGroups(),
      })
    }
  })

  tabManager.onDidChangeTabGroups((tabGroups) => {
    if (!tabManager || !managedState || !reposBranchManager) {
      return
    }

    const headTabGroupsMapping = managedState.getHead()

    if (headTabGroupsMapping?.branchName) {
      managedState.updateHistory({
        branchName: headTabGroupsMapping.branchName,
        tabGroups: tabManager.getEditorTabGroups(),
      })
    }

    managedState.updateHead(tabGroups)
  })

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('-----------------------------------------------------------')
  console.log('Congratulations, your extension "tabularasa" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
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
  reposBranchManager?.cleanup()
  tabManager?.cleanup()
}
