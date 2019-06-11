require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');
const app = require('../lib/app');

const createNote = note => {
  return request(app)
    .post('/api/v1/notes')
    .send(note)
    .then(res => res.body);
};

describe('notes routes', () => {
  beforeAll(() => {
    return connect();
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a note via the post method', () => {
    return request(app)
      .post('/api/v1/notes')
      .send({ title: 'cool title', body: 'cool body' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'cool title',
          body: 'cool body',
          __v: 0
        });
      });
  });

  it('can get a list of notes', async() => {
    const notes = await Promise.all([
      createNote({ title: 'cool', body: 'body2' }),
      createNote({ title: 'cool', body: 'body3' }),
      createNote({ title: 'cool', body: 'body' })
    ]);

    return request(app)
      .get('/api/v1/notes')
      .then(res => {
        expect(res.body).toEqual(notes);
      });
  });

});
