import request from 'supertest';

import app from '@src/app';

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app).get('/api/v1').set('Accept', 'application/json').expect('Content-Type', /json/).expect(
      200,
      {
        success: false,
        error: true,
        message: 'Welcome to blog API',
        status: 200,
        data: null,
      },
      done
    );
  });
});
