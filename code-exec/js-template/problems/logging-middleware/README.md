# Logging Middleware

## Problem Description
We need to monitor incoming requests to our server. Create an Express.js middleware function that logs the HTTP method and the URL of every incoming request to the console.

## Requirements
1.  Log the message in the format: `[METHOD] URL`.
    *   Example: `[GET] /api/users`
    *   Example: `[POST] /login`
2.  Ensure that the middleware calls `next()` so that the request processing can continue.

## Tests
The test suite will check if:
*   The console output matches the expected format.
*   The middleware allows the request to pass through to the route handler.
