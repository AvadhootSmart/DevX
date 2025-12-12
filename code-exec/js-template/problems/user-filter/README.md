# User Filter

## Problem Description
You are working on a dashboard that needs to display users who meet certain criteria. Implement a function that filters a list of users to find those strictly older than a given age.

## Requirements
*   Function Name: `filterUsers(users, minAge)`
*   Input:
    *   `users`: An array of objects, where each object has a `name` (string) and `age` (number).
    *   `minAge`: A number representing the minimum age.
*   Output: An array of user objects where `user.age` is strictly greater than `minAge`.

## Example
```javascript
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];
filterUsers(users, 25); // Returns [{ name: 'Bob', age: 30 }]
```
