# how

when initialized, if theres a `current`, don't do anything, otherwise, fill it with the repos paths
using `gitApi.onDidOpenRepository`

afterwords, on subsequent events, see if the repo path is inside current

## back to square 1

so let's say we start with a non-empty `current`.
When a repo has changed, get the `rootUri` and see if it's in `current` and if it's there,
compare the new HEAD with the one from `current`. If it is, don't to anything. If not, check the history
and see if there a repo with the same rootURI and the same branch name. If There is one, it means
we can "restore" tabs

## initial vs subsequent events

can have a counter represeting the total no. or repos and when that is zero(type is `number | null`)
it means it's passed initial...

don't matter if it's either initial or subsequent!

## anytime

the state of the workspace is the set of the total repos(name, path) and the tab groups opened

when an event triggers, if a (new) repo/branch pair is not in `current`, update the history with the
value of `current`...

#### the issue with events

b/c the pairs are being teste one-by-one, you cannot rely on `current` so for this to work, each time...

```
[]
> [a1] => [a1]
> [b1] => [a1, b1]
> [c1] => [a1, b1, c1]
// a1 already in set, continue
> [a1] => [a1, b1, c1]
// b1 already in set, continue
> [b1] => [a1, b1, c1]
...
// a2 not in set, create a new one
> [a2] => [[a2, b1, c1], [a1, b1, c1]]
// a1 not in head, but found in the tail
...
> [b2] => [a1, b2], [a1, b1]
> [x2] => [x2, a1, b2], [a1, b2], [a1, b1]
> [b1] => ... how to merge?
```

#### data structure

when retrieving the 'current', always get the head of the list

if the key is already in the list, but the branch head name don\t match
  - search for
if the key is not in the list, search for another entry with the same key

```
[
  {
    ['repo_path_1']: 'branch_head_name',
    ['repo_path_2']: 'branch_head_name'
  }
]
```
