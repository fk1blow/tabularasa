import { Disposable, EventEmitter, extensions } from 'vscode'
import {
  GitExtension,
  API as GitApi,
  APIState,
  Repository,
} from './lib/vscode-git/git'

export class BranchManager {
  private _onDidChangeBranchHead: EventEmitter<string>

  private _onDidChangeStateDisposable: Disposable

  private gitApi: GitApi

  constructor() {
    this._onDidChangeBranchHead = new EventEmitter<string>()

    const gitExtension: GitExtension =
      extensions.getExtension<GitExtension>('vscode.git')!.exports

    this.gitApi = gitExtension.getAPI(1)

    this._onDidChangeStateDisposable = this.gitApi.onDidChangeState((evt: APIState) => {
      if (evt !== 'initialized') {
        return
      }

      // don't care if theres more than 1 repo, or none at all
      if (this.gitApi.repositories.length !== 1) {
        return
      }

      this.gitApi.repositories.forEach((repo: Repository) => {
        const disposable = repo.state.onDidChange((e) => {
          if (!repo.state.HEAD?.name) {
            return
          }
          this._onDidChangeBranchHead.fire(repo.state.HEAD.name)
        })
      })
    })
  }

  cleanup() {
    this._onDidChangeStateDisposable.dispose()
  }

  get onDidChangeBranchHead() {
    return this._onDidChangeBranchHead.event
  }
}
