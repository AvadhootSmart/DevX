const filterUsers = require('./solution');

describe('filterUsers', () => {
    const users = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 20 },
        { name: 'David', age: 35 }
    ];

    test('filters users older than 25', () => {
        const result = filterUsers(users, 25);
        expect(result).toEqual([
            { name: 'Bob', age: 30 },
            { name: 'David', age: 35 }
        ]);
    });

    test('filters users older than 30', () => {
        const result = filterUsers(users, 30);
        expect(result).toEqual([
            { name: 'David', age: 35 }
        ]);
    });

    test('returns empty array if no one matches', () => {
        const result = filterUsers(users, 40);
        expect(result).toEqual([]);
    });

    test('handles empty input array', () => {
        expect(filterUsers([], 25)).toEqual([]);
    });
});
