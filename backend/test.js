const request = require('supertest');
const express = require('express');

// Mock server for testing
const app = express();
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

describe('GET /api/health', () => {
    it('should return status UP', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'UP');
    });
});
