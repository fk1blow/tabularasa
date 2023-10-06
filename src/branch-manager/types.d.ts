export type ContainedRepositories = string[]

export type RepositoryTabGroups = string[]

export interface ManagedWorkspace {
  repositories: ContainedRepositories
  tabGroups: RepositoryTabGroups[]
}

export type CurrentManagedWorkspace = ManagedWorkspace
export type HistoryManagedWorkspace = ManagedWorkspace[]
