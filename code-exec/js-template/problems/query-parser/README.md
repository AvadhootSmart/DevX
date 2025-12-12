# Query String Parser

## Problem Description
Implement a function that parses a URL query string into a JavaScript object. This is a common task when handling HTTP requests without a framework or when processing custom deep links.

## Requirements
*   Function Name: `parseQueryString(queryString)`
*   Input: A string starting with `?` (e.g., `?foo=bar&baz=qux`).
*   Output: An object where keys and values correspond to the query parameters.
*   Constraints:
    *   Do not use `URLSearchParams`.
    *   Handle URI encoding (e.g., `%20` becomes space).
    *   Return an empty object for invalid inputs or empty strings.

## Example
```javascript
parseQueryString('?name=Alice&city=Wonderland');
// Returns { name: 'Alice', city: 'Wonderland' }
```
