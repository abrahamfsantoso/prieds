const request = require('supertest');
const User = require('../models/User');
const app = require('../app');

beforeAll(async () => {
  await User.deleteMany();
});

describe('Auth Test', () => {
  describe('REGISTER', () => {
    it('Successfully register new user', async () => {
      const res = await request(app).post('/auth/register').send({
        userName: 'nickfury',
        firstName: 'Nicholas',
        lastName: 'Fury',
        email: 'nick@gmail.com',
        password: 'nick1234',
        confirmPassword: 'nick1234',
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('_id');
    });

    // Test the error
    it('Failed to register', async () => {
      const res = await request(app).post('/auth/register').send({
        userName: 'nickfury',
        firstName: 'Nicholas',
        lastName: 'Fury',
        email: 'nick@gmail.com',
        password: 'nick1234',
        confirmPassword: 'nick1234',
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('keyValue');
    });
  });
  describe('LOGIN', () => {
    it('Successfully login', async () => {
      const res = await request(app).post('/auth/login').send({
        userName: 'nickfury',
        password: 'nick1234',
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('accessToken');
    });

    it('Failed to login', async () => {
      const res = await request(app).post('/auth/login').send({
        userName: 'nickfury',
        password: 'nick12345',
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual('Wrong credentials!');
    });
  });
});
