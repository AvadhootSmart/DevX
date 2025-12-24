# Pagination Regression – API Performance Ticket

## Context

You’ve been assigned a backend task after a performance regression.

A recent change added pagination to the `/orders` endpoint. Since then, customers report missing or duplicated data when navigating pages.

## Problem

Pagination logic is incorrect and inconsistent:

- Page boundaries are wrong
- Invalid query params cause unexpected behavior
- Edge cases return incorrect results

## Your Task

Fix the pagination logic so that:

- Pagination is deterministic
- Invalid parameters are handled safely
- Results are correct across page transitions

## Constraints & Assumptions

- Data is in-memory for this exercise
- Query params: `page`, `limit`
- Page numbering starts at 1