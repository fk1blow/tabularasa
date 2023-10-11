# Development

how to get started? What are the things i need to do for this to work?
Data structures, storage, etc

## what do i need

Need to work with the `workspaceState` and keep track of repositories and opened tabs

```
{
  current: { branch_name: [tab_group_1, tab_group_2] },

  history: [
    { branch_name: [tab_group_1, tab_group_2] },
    { another_branch_name: [tab_group_1, tab_group_2] },
    ...
  ]
}
```

## how to start

need to have some conditions in place for when the `current` is empty or when the
tab change event was fired but the branch name is the same with the `current`...

### notifying the user

if the branch changes and theres a `current` entry, the user needs to receive a notification.
Need to keep a reference to the tab groups for when the user accepts the swap or not.

### branch manager

conditions:
1. `current` is empty(the whole state might be empty)
2. branch changed, therefore not eq to `current`

When the branch name changes:
1. if the `current` is empty, fill it with the branch name and tab groups

### tab manager

when the branch changes, get the list of tabs and create a new `current` entry, with the
name of the branch and the tabs.
when tabs change, update the `current` tabs list
