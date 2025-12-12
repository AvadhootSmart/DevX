const request = require('supertest');
const express = require('express');
const loggingMiddleware = require('./solution');

describe('Logging Middleware', () => {
    let app;
    let consoleSpy;

    beforeEach(() => {
        app = express();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        app.use(loggingMiddleware);
        app.get('/test', (req, res) => res.status(200).send('OK'));
        app.post('/api/data', (req, res) => res.status(201).send('Created'));
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test('logs GET request correctly', async () => {
        await request(app).get('/test');
        expect(consoleSpy).toHaveBeenCalledWith('[GET] /test');
    });

    test('logs POST request correctly', async () => {
        await request(app).post('/api/data');
        expect(consoleSpy).toHaveBeenCalledWith('[POST] /api/data');
    });

    test('calls next()', async () => {
        const response = await request(app).get('/test');
        expect(response.status).toBe(200);
    });
});
