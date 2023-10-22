# Manage changes

there are events that need to handle state mutation, like when switching(checkout)
to another branch or manipulating the tab groups.
When this happens, there needs to be an object(class?) in charge of this logic.

## types of events

1. when switching to another branch
2. user modifies tabs/groups

## when switching to another branch

when user switches branches, you need to take care of multiple events(initial ones).

When receiving an event:
- switch current to the new branch
- make sure incoming branch name is not the active one(multiple triggers)
- update history of the workspace state

## user modifies tabs/groups

this also has to cases: when user switxhes tabs/groups and when he wants to
replace his whole tab groups with another one.

__The former would need a way to distinguish from the first one, and one way
of doing it might be to simply disabled tab/groups events until the user has
finished switching/replacing the `active` with the `history` selected entry!__
