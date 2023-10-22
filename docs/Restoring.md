# Restoring

How to restore the tab groups? How  to distingguish between normal user actions
like close, open, reopen, and restoring a tab group?
...

## temporarely disable WorkspaceTabsMananger

disable `window.tabGroups.onDidChangeTabs` when attempting to restore the tabs
and restore the events after restoring finished.

__Note that the restore procedure might not be syncrhonous!__
