const rateLimiter = (limit, windowMs) => {
    let requestCount = 0;
    let startTime = Date.now();

    return (req, res, next) => {
        const currentTime = Date.now();

        // Bug: Logic allows bypassing limit if requests come right after window reset
        // or simply doesn't scope by IP/User (Global rate limiter)

        if (currentTime - startTime < windowMs) {
            if (requestCount < limit) {
                requestCount++;
                next();
            } else {
                res.status(429).json({ error: "Too many requests" });
            }
        } else {
            startTime = currentTime;
            requestCount = 0; // BUG: Should account for the current request!
            next();
        }
    };
};

module.exports = rateLimiter;
