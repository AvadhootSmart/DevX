function parseQueryString(queryString) {
    if (!queryString || !queryString.startsWith('?')) {
        return {};
    }

    const query = queryString.slice(1); // Remove '?'
    if (!query) return {};

    const pairs = query.split('&');
    const result = {};

    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            // Decode URI components to handle special characters
            result[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
        }
    }

    return result;
}

module.exports = parseQueryString;
