const request = require('supertest');
const app = require('../app');

let user;
let admin;
let adminToken;
let accessToken;

beforeAll(async () => {
  const adminRegister = await request(app).post('/auth/register').send({
    userName: 'mariahill',
    firstName: 'Maria',
    lastName: 'Hill',
    email: 'maria@gmail.com',
    password: 'maria1234',
    confirmPassword: 'maria1234',
    isAdmin: true,
  });

  const adminResponse = await request(app).post('/auth/login').send({
    userName: 'mariahill',
    password: 'maria1234',
  });

  admin = adminResponse.body;
  adminToken = adminResponse.body.accessToken;

  const res = await request(app).post('/auth/login').send({
    userName: 'nickfury',
    password: 'nick1234',
  });
  user = res.body;
  accessToken = res.body.accessToken;
});

describe('User Test', () => {
  describe('GET ALL USERS', () => {
    it('Successfully get all users', async () => {
      const res = await request(app)
        .get(`/users`)
        .set({
          token: `Bearer ${adminToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
    });

    it('Failed to get all users', async () => {
      const res = await request(app)
        .get(`/users`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toBe('You are not allowed to do that!');
    });
  });
  describe('Get a single user', () => {
    it('Successfully get a single user', async () => {
      const res = await request(app)
        .get(`/users/find/${user._id}`)
        .set({
          token: `Bearer ${adminToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('profilePicture');
    });

    it('Failed to get a single user', async () => {
      const res = await request(app)
        .get(`/users/find/${user._id}`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toBe('You are not allowed to do that!');
    });
  });
  describe('UPDATE', () => {
    it('Successfully updated user credentials (profilepicture)', async () => {
      const res = await request(app)
        .put(`/users/${user._id}`)
        .send({
          profilePicture:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.antaranews.com%2Fberita%2F1749153%2Fsamuel-l-jackson-kembali-perankan-nick-fury-di-serial-disney-&psig=AOvVaw2OGty9pZlQbY9s7YRq4fMc&ust=1637207812515000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIil8MTAnvQCFQAAAAAdAAAAABAM',
        })
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('profilePicture');
    });

    it('Failed to update user credentials (profilepicture)', async () => {
      const res = await request(app)
        .put(`/users/${user._id}123`)
        .send({
          profilePicture:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.antaranews.com%2Fberita%2F1749153%2Fsamuel-l-jackson-kembali-perankan-nick-fury-di-serial-disney-&psig=AOvVaw2OGty9pZlQbY9s7YRq4fMc&ust=1637207812515000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIil8MTAnvQCFQAAAAAdAAAAABAM',
        })
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toBe('You are not allowed to do that!');
    });
  });
  describe('DELETE', () => {
    it('Successfully deleted user', async () => {
      const res = await request(app)
        .delete(`/users/${user._id}`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBe('User has been deleted...');
    });

    it('Failed to delete user', async () => {
      const res = await request(app)
        .delete(`/users/${user._id}`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBe('User not found!');
    });
  });
});
