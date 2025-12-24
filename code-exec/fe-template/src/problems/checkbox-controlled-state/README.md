# Controlled Checkbox State Bug

## Context

A recent component refactor attempted to standardize form controls across the app. Shortly after release, QA noticed that checkbox values are no longer reliably synced with application state.

## Problem

The `AgreementCheckbox` component visually toggles, but its internal state is not correctly synchronized with the `checked` prop provided by the parent.

This causes issues in forms where the checkbox state is controlled externally (e.g. form reset, validation).

## Your Task

Fix the component so that:

- It behaves as a fully controlled component
- `checked` prop is the single source of truth
- `onChange` is called with the correct next value
- The component is accessible and predictable

## Constraints

- Do not introduce internal state for `checked`
- Use standard HTML input semantics