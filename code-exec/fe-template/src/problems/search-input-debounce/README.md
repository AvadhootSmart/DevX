# Search Input Debounce Regression

## Context

A recent UI refactor introduced a regression in the global search input component used across multiple dashboards.

Users report that search requests are firing on every keystroke instead of being debounced, causing performance issues and unnecessary backend load.

## Problem

The `SearchInput` component was supposed to debounce calls to `onSearch`, but the current implementation behaves inconsistently and ignores the debounce delay under certain conditions.

## Your Task

Fix the `SearchInput` component so that:

- User input is reflected immediately in the UI
- `onSearch` is called only after the user stops typing for the specified delay
- The component behaves correctly when the input is cleared
- The component remains accessible

## Constraints

- Use React hooks only
- Do not introduce external debounce libraries
- Keep the component controlled