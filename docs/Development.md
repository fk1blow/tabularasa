# Development

how to get started? What are the things i need to do for this to work?
Data structures, storage, etc

## what do i need

Need to work with the `workspaceState` and keep track of repositories and opened tabs

```
{
  current: {
    repositories: ['f/top-b-1', 'main'], tabGroups: [[tab_1, tab_2, etc]]
  },

  history: [
    {
      repositories: ['master'],
      tabGroups: [[tab_1, tab_2, etc]]
    },

    {
      repositories: ['development'],
      tabGroups: [[tab_1, tab_2, etc]]
    }
  ]
}
```

## use cases

want to have a class that deals with repository events, that detects if a `ManagedWorkspace` has
changed by comparing (git repo) events against the `current`
