import request from 'supertest';

import { app } from '@src/server';

describe('Health Check API endpoints', () => {
  it('GET / - success', async () => {
    const response = await request(app).get('/health-check');

    expect(response.statusCode).toEqual(200);
  });
});
