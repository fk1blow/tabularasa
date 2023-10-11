// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import stringify from 'json-stringify-safe'

import { API, APIState, GitExtension } from './lib/vscode-git/git'
import { GitBaseExtension } from './lib/vscode-git/git-base'
import { WorkspaceTabsMananger } from './WorkspaceTabsManager'
import { BranchManager } from './BranchManager'
import { ManagedWorkspaceState } from './ManagedWorkspaceState'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    '----------------------------------- helloworld activated ----------------------------------------'
  )
  // const gitExtension: GitExtension =
  //   vscode.extensions.getExtension<GitExtension>('vscode.git')!.exports
  // const gitApi: API = gitExtension.getAPI(1)

  // gitApi.onDidChangeState((evt: APIState) => {
  //   console.log('evt: ', evt)
  //   gitApi.repositories.forEach((repo: Repository) => {
  //     // console.log('repo---: ', repo.state.HEAD)
  //     // console.log('repo.rootUri: ', repo.rootUri)
  //     repo.state.onDidChange((e) => {
  //       // console.log('state.onDidChange, head: ', repo.state.HEAD?.name)
  //       console.log(
  //         'repo.state.workingTreeChanges: ',
  //         repo.state.workingTreeChanges
  //       )
  //     })
  //   })
  // })

  // console.log('gitExtension.enabled: ', gitExtension.enabled)
  // gitExtension.onDidChangeEnablement((evt) => {
  //   console.log('evt: ', evt)
  // })

  // gitApi.repositories.forEach((repo: Repository) => {
  //   console.log(repo.rootUri.path, repo.ui.selected)
  //   repo.state.onDidChange((e) => {
  //     console.log('-------- repo state changed')
  //     console.log('repo: ', repo)
  //     console.log('repo.rootUri: ', repo.rootUri)
  //     console.log('repo.state.HEAD: ', repo.state.HEAD)
  //     // console.log("repo.state.REFS: ", repo.state.refs)
  //   })
  //   // WORKS
  //   // repo.ui.onDidChange(() => {
  //   // 	console.log('---------------onDidChange: ', repo.rootUri.path, repo.ui.selected);
  //   // });
  // })

  // ---------------------------------------------------------------------------

  const tabManager = new WorkspaceTabsMananger(context)
  const managedState = new ManagedWorkspaceState(context)
  const reposBranchManager = new BranchManager(managedState)

  // managedState.reset()

  reposBranchManager.onDidChangeBranchHead((branchName) => {
    const currentXo = managedState.getCurrent()
    // return

    // if theres no current, we need to initialize it
    if (!currentXo) {
      managedState.changeCurrent({
        branchName,
        tabGroups: tabManager.getEditorTabGroups(),
      })
      return
    }

    // If theres a `current` but it's not the `branchName`
    if (branchName !== currentXo.branchName) {
      // if the new branch is already in history,
      // change the notification
      const history = managedState.getHistory()
      if (history[branchName]) {
        managedState.changeNotification(history[branchName])
      }

      managedState.changeCurrent({
        branchName,
        tabGroups: tabManager.getEditorTabGroups(),
      })
    }
  })

  tabManager.onDidChangeTabGroups((tabGroups) => {
    const currentXo = managedState.getCurrent()
    if (currentXo?.branchName) {
      managedState.updateHistory({
        branchName: currentXo.branchName,
        tabGroups: tabManager.getEditorTabGroups(),
      })
    }
    managedState.updateCurrentTabs(tabGroups)
  })

  // context.workspaceState.update('repositories', {
  //   active: ['f/top-b-1', 'main'],
  // })
  // context.workspaceState.update('repositories', undefined)
  // console.log('state: ', context.workspaceState.get('repositories'))

  // vscode.window.onDidChangeActiveTextEditor((event) => {
  //   console.log('event: ', event)
  // })

  vscode.window.tabGroups.onDidChangeTabs((evt: vscode.TabChangeEvent) => {
    // vscode.workspace.textDocuments.forEach((doc) => {
    //   console.log('doc.uri: ', doc.uri.path)
    // })

    // console.log('evt.opened: ', evt.opened)
    // console.log('evt.closed: ', evt.closed)
    evt.closed.forEach((tab: vscode.Tab) => {
      console.log(tab.input instanceof vscode.TabInputText)
      // console.log('tab: ', tab.label, tab.input['uri'].path)
    })
  })

  // ---------------------------------------------------------------------------

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
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
export function deactivate() {}
