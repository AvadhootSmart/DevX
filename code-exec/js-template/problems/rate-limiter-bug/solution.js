const rateLimiter = (limit, windowMs) => {
    const ipRequests = new Map();

    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const currentTime = Date.now();

        if (!ipRequests.has(ip)) {
            ipRequests.set(ip, {
                count: 1,
                startTime: currentTime
            });
            return next();
        }

        const userData = ipRequests.get(ip);

        if (currentTime - userData.startTime < windowMs) {
            if (userData.count < limit) {
                userData.count++;
                next();
            } else {
                res.status(429).json({ error: "Too many requests" });
            }
        } else {
            // Reset window
            userData.startTime = currentTime;
            userData.count = 1;
            next();
        }
    };
};

module.exports = rateLimiter;
