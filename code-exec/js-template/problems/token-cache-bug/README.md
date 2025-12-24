# Token Cache Bug – Production Incident

## Context

You’ve been assigned a backend bugfix after a production incident.

Several users reported being randomly logged out. Investigation shows that our API token validation middleware was recently “optimized” with caching, but something is off.

## Problem

The `/profile` endpoint relies on a cached token validation layer.  
In production, **invalid or expired tokens are sometimes treated as valid**, and valid tokens can intermittently fail.

The issue seems related to how the cache is implemented and how token expiry is handled.

## Your Task

Fix the authentication middleware so that:

- Valid tokens are accepted
- Invalid or expired tokens are rejected
- Cached entries respect token expiration
- The behavior is deterministic and safe

## Constraints & Assumptions

- Tokens are passed via `Authorization: Bearer <token>`
- Token format is `userId:expiryTimestamp`
- No external auth service is involved
- Do not change the API contract