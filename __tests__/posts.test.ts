import request from 'supertest';

import app from '@src/app';

describe('GET /api/v1/posts', () => {
  it('responds with an array of posts', async () =>
    request(app)
      .get('/api/v1/posts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.data).toHaveProperty('length');
        expect(response.body.data.length).toBe(100);
        expect(response.body.data[0]).toHaveProperty('userId');
        expect(response.body.data[0]).toHaveProperty('title');
      }));
});
