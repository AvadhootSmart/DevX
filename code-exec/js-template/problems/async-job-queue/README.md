# Async Job Queue Implementation

## Problem Description
We need a robust mechanism to handle background tasks, such as processing image uploads or sending emails. Complete the `JobQueue` class to support asynchronous job processing with configurable concurrency and retry logic.

## Goal
Implement a `JobQueue` class that:
1.  Allows adding async tasks with a specified number of retries.
2.  Processes tasks up to a defined concurrency limit.
3.  Automatically retries failed tasks if retries are available.
4.  Returns a Promise from `add()` that resolves/rejects when the job performs successfully or exhausts retries.

## Tests
The test suite verifies:
1.  Basic job processing.
2.  Concurrency control (e.g., max 2 jobs running at once).
3.  Retry mechanism (task eventually succeeds).
4.  Failure handling (task fails after retries).

## Solution
The solution uses an internal queue array and tracks active count. It wraps logic in Promises to allow callers to await job completion.
