# Rate Limiter Middleware Bug

## Problem Description
The current rate limiter implementation has a critical bug. It uses a global counter instead of tracking requests per user/IP. Additionally, the window reset logic might be flawed, potentially allowing an extra request or resetting incorrectly.

## Goal
Refactor the middleware to:
1.  Track requests independently for each IP address.
2.  Correctly enforce the request limit within the specified time window.
3.  Reset the count correctly when the window expires.

## Tests
The test suite verifies:
1.  Requests within the limit are allowed (200 OK).
2.  Requests exceeding the limit are blocked (429 Too Many Requests).
3.  The limit resets after the specified time window (1000ms in tests).

## Solution
The solution uses a `Map` to store request counts and timestamps for each IP address.
