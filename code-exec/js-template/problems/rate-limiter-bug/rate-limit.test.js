const request = require('supertest');
const express = require('express');
const rateLimiter = require('./solution'); // Test against solution for verification, but user code will be swapped in submission

describe('Rate Limiter Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        // different limit for testing: 5 reqs per 1 sec
        app.use(rateLimiter(5, 1000));
        app.get('/', (req, res) => res.status(200).send('OK'));
    });

    test('allows requests within limit', async () => {
        for (let i = 0; i < 5; i++) {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
        }
    });

    test('blocks requests over limit', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app).get('/');
        }
        const response = await request(app).get('/');
        expect(response.status).toBe(429);
    });

    test('resets after window', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app).get('/');
        }

        // Wait for window to expire
        await new Promise(r => setTimeout(r, 1100));

        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});
