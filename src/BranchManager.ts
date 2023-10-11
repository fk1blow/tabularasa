import { EventEmitter, ExtensionContext, extensions } from 'vscode'
import {
  GitExtension,
  API,
  APIState,
  Repository,
  Branch,
} from './lib/vscode-git/git'
import { ManagedWorkspaceState } from './ManagedWorkspaceState'

// this class listens to the git extension's events and
export class BranchManager {
  // private _onDidChange = new EventEmitter<void>()
  private _onDidChangeBranchHead: EventEmitter<string>

  private gitApi: API

  constructor(private managedState: ManagedWorkspaceState) {
    this._onDidChangeBranchHead = new EventEmitter<string>()

    const gitExtension: GitExtension =
      extensions.getExtension<GitExtension>('vscode.git')!.exports

    this.gitApi = gitExtension.getAPI(1)

    let count: number | null = null

    this.gitApi.onDidChangeState((evt: APIState) => {
      if (evt !== 'initialized') {
        return
      }

      // console.log('this.managedState: ', this.managedState)
      // console.log('this.gitApi.repositories: ', this.gitApi.repositories)

      // don't care if theres more than 1 repo, or none at all
      if (this.gitApi.repositories.length !== 1) {
        return
      }

      // const branchHeads = this.gitApi.repositories
      //   .map((r) => r.state.HEAD?.name)
      //   .filter((n): n is string => n !== undefined)

      // console.log('>>>>>>>>> this.gitApi.onDidChangeState')

      this.gitApi.repositories.forEach((repo: Repository) => {
        // console.log('repo.state: ', repo.state.submodules) // ;nothing to see here
        // console.log('repo.state.HEAD.name: ', repo.state.HEAD?.name)

        const disposable = repo.state.onDidChange((e) => {
          if (!repo.state.HEAD?.name) {
            return
          }
          this._onDidChangeBranchHead.fire(repo.state.HEAD.name)
          // console.log('repo.state.HEAD.name: ', repo.state.HEAD?.name)
          // console.log('count: ', count)
          // console.log(
          //   'repo.state.onDidChange: ',
          //   repo.state.HEAD?.name,
          //   repo.rootUri.path
          // )
        })
      })
    })

    // 1111111
    // this.gitApi.onDidOpenRepository((r: Repository) => {
    //   // console.log('--> name....: ', r.state.HEAD?.name)

    //   count = count === null ? 1 : count + 1
    //   // console.log('----------- gitApi.onDidOpenRepository ', count)

    //   const disposable = r.state.onDidChange((e) => {
    //     console.log('r.rootUri: ', r.state.HEAD?.name, r.rootUri.path)
    //     // console.log('r: ', r.state.HEAD?.name)
    //     // disposable.dispose()

    //     if (count !== null) {
    //       count -= 1
    //     }

    //     if (count === 0) {
    //       // this.startWatchingChanges()
    //     }
    //   })
    // })
  }

  private startWatchingChanges() {
    this.gitApi.repositories.forEach((repo: Repository) => {
      const disposable = repo.state.onDidChange((e) => {
        console.log(
          'repo.state.onDidChange: ',
          repo.state.HEAD?.name,
          repo.rootUri.path
        )
      })
    })
  }

  get onDidChangeBranchHead() {
    return this._onDidChangeBranchHead.event
  }

  private currentHasChanged() {}
}
