// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"
import { GitExtension, Repository } from "./git"
import { GitBaseExtension } from "./git-base"

const logGitStatus = async (repo: Repository) => {
	const status = await repo.state.workingTreeChanges
	console.log('status: ', status)
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('----------------------------------- helloworld activated ----------------------------------------')
  const gitExtension =
    vscode.extensions.getExtension<GitExtension>("vscode.git")!.exports
  const gitApi = gitExtension.getAPI(1)

  gitApi.repositories.forEach((repo: Repository) => {
    console.log(repo.rootUri.path, repo.ui.selected)
    repo.state.onDidChange((e) => {
      console.log("-------- repo state changed")
      console.log("repo: ", repo)
      console.log('repo.rootUri: ', repo.rootUri)
      console.log("repo.state.HEAD: ", repo.state.HEAD)
      // console.log("repo.state.REFS: ", repo.state.refs)
    })
    // WORKS
    // repo.ui.onDidChange(() => {
    // 	console.log('---------------onDidChange: ', repo.rootUri.path, repo.ui.selected);
    // });
  })

  // ---------------------------------------------------------------------------

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "tabularasa" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "tabularasa.helloWorld",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      // vscode.window.showInformationMessage("Hello World from tabularasa!")
      const response = await vscode.window.showInformationMessage("Hello World from tabularasa!", "ok", 'cancel')
      console.log('response: ', response)
    }
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
