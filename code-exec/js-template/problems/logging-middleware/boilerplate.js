const loggingMiddleware = (req, res, next) => {
    // TODO: Log the request method and URL in the format: "[METHOD] URL"
    // e.g., "[GET] /api/users"

    // Don't forget to call next() to pass control to the next middleware!
    next();
};

module.exports = loggingMiddleware;
