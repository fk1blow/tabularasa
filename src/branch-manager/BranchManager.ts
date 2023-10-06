import { EventEmitter, ExtensionContext, extensions } from 'vscode'
import { GitExtension, API, APIState, Repository, Branch } from '../git'
import {
  ContainedRepositories,
  HistoryManagedWorkspace,
  ManagedWorkspace,
  RepositoryTabGroups,
} from './types'
import { ManagedWorkspaceState } from '../ManagedWorkspaceState'

// this class listens to the git extension's events and
export class BranchManager {
  // private _onDidChange = new EventEmitter<void>()
  private _onDidChangeFile: EventEmitter<unknown>

  private gitApi: API

  constructor(private managedState: ManagedWorkspaceState) {
    this._onDidChangeFile = new EventEmitter<unknown>()

    const gitExtension: GitExtension =
      extensions.getExtension<GitExtension>('vscode.git')!.exports

    this.gitApi = gitExtension.getAPI(1)

    let count: number | null = null

    this.gitApi.onDidChangeState((evt: APIState) => {
      console.log('git api initialized')
      if (evt !== 'initialized') {
        return
      }

      const branchHeads = this.gitApi.repositories
        .map((r) => r.state.HEAD?.name)
        .filter((n): n is string => n !== undefined)

      // console.log('branchHeads: ', branchHeads)

      // this.managedState.setCurrent({ repositories: branchHeads, tabGroups: [] })
      // console.log(
      //   'this.managedState.getCurrent(): ',
      //   this.managedState.getCurrent().repositories
      // )

      // console.log('this.getCurrent(): ', this.getCurrent())

      // -------------------------------------------------------------------------------------------
      // console.log('gitApi.repositories: ', gitApi.repositories)

      // this._onDidChangeFile.fire('sux')
      console.log(
        'this.gitApi.repositories.length: ',
        this.gitApi.repositories.length
      )

      count = count === null ? this.gitApi.repositories.length : count + 1

      this.gitApi.repositories.forEach((repo: Repository) => {
        // console.log('repo.state: ', repo.state.submodules) // ;nothing to see here
        // console.log('repo.state.HEAD.name: ', repo.state.HEAD?.name)

        const disposable = repo.state.onDidChange((e) => {
          console.log('repo.state.HEAD.name: ', repo.state.HEAD?.name)
          console.log('count: ', count)
          console.log(
            'repo.state.onDidChange: ',
            repo.state.HEAD?.name,
            repo.rootUri.path
          )

          if (count !== null) {
            count -= 1
          }

          if (count === 0) {
            console.log('count is zero')
            // this.startWatchingChanges()
          }
        })
      })
    })

    // 1111111
    this.gitApi.onDidOpenRepository((r: Repository) => {
      console.log('>>>>>>>>>> onDidOpenRepository')
      return
      // console.log('--> name....: ', r.state.HEAD?.name)

      count = count === null ? 1 : count + 1
      // console.log('----------- gitApi.onDidOpenRepository ', count)

      const disposable = r.state.onDidChange((e) => {
        console.log('r.rootUri: ', r.state.HEAD?.name, r.rootUri.path)
        // console.log('r: ', r.state.HEAD?.name)
        // disposable.dispose()

        if (count !== null) {
          count -= 1
        }

        if (count === 0) {
          // this.startWatchingChanges()
        }
      })
    })
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

  get onDidChangeCurrent() {
    return this._onDidChangeFile.event
  }

  private currentHasChanged() {}
}
