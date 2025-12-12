const parseQueryString = require('./solution');

describe('parseQueryString', () => {
    test('parses simple query string', () => {
        expect(parseQueryString('?name=John&age=30')).toEqual({
            name: 'John',
            age: '30'
        });
    });

    test('handles single parameter', () => {
        expect(parseQueryString('?search=test')).toEqual({
            search: 'test'
        });
    });

    test('handles empty string or missing ?', () => {
        expect(parseQueryString('')).toEqual({});
        expect(parseQueryString('invalid')).toEqual({});
    });

    test('handles URI encoding', () => {
        expect(parseQueryString('?query=hello%20world&id=1')).toEqual({
            query: 'hello world',
            id: '1'
        });
    });

    test('handles keys without values', () => {
        expect(parseQueryString('?a=&b')).toEqual({
            a: '',
            b: ''
        });
    });
});
