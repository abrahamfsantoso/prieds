const request = require('supertest');
const Customer = require('../models/Customer');
const app = require('../app');

let user;
let customer;
let accessToken;

beforeAll(async () => {
  const res = await request(app).post('/auth/login').send({
    userName: 'nickfury',
    password: 'nick1234',
  });
  user = res.body;
  accessToken = res.body.accessToken;
  await Customer.deleteMany();
});

describe('Customer Test', () => {
  describe('Add new customer', () => {
    it('Successfully add new user', async () => {
      const res = await request(app)
        .post(`/customers/add/`)
        .send({
          firstName: 'Peter',
          lastName: 'Parker',
          gender: 'Male',
          dateOfBirth: '1991-04-18',
          email: 'peter@gmail.com',
          homeAddress: 'Brooklyn, USA',
          phoneNumber: '123 555 555',
        })
        .set({
          token: `Bearer ${accessToken}`,
        });

      customer = res.body;
      expect(res.statusCode).toEqual(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('profilePicture');
    });

    it('Failed to add new user', async () => {
      const res = await request(app)
        .post(`/customers/add/`)
        .send({
          firstName: 'Peter',
          lastName: 'Parker',
          gender: 'Male',
          dateOfBirth: '1991-04-18',
          email: 'peter@gmail.com',
          homeAddress: 'Brooklyn, USA',
          phoneNumber: '123 555 555',
        })
        .set({
          token: `Bearer ${accessToken}1`,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toBe('Token is not valid!');
    });
  });
  describe('GET ALL Customers', () => {
    it('Successfully get all customers', async () => {
      const res = await request(app)
        .get(`/customers`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
    });

    it('Failed to get all customers', async () => {
      const res = await request(app)
        .get(`/customers`)
        .set({
          token: `Bearer ${accessToken}1`,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toBe('Token is not valid!');
    });
  });
  describe('Get a single customer', () => {
    it('Successfully get a single customer', async () => {
      const res = await request(app)
        .get(`/customers/find/${customer._id}`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('profilePicture');
    });

    it('Failed to get a single customer', async () => {
      const res = await request(app)
        .get(`/customers/find/${customer._id}`)
        .set({
          token: `Bearer ${accessToken}1`,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toBe('Token is not valid!');
    });
  });
  describe('UPDATE Customer', () => {
    it('Successfully updated customer credentials (profilepicture)', async () => {
      const res = await request(app)
        .put(`/customers/${customer._id}`)
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

    it('Failed to update customer credentials (profilepicture)', async () => {
      const res = await request(app)
        .put(`/customers/${customer._id}`)
        .send({
          profilePicture:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.antaranews.com%2Fberita%2F1749153%2Fsamuel-l-jackson-kembali-perankan-nick-fury-di-serial-disney-&psig=AOvVaw2OGty9pZlQbY9s7YRq4fMc&ust=1637207812515000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIil8MTAnvQCFQAAAAAdAAAAABAM',
        })
        .set({
          token: `Bearer ${accessToken}1`,
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body).toBe('Token is not valid!');
    });
  });
  describe('DELETE customer', () => {
    it('Successfully deleted customer', async () => {
      const res = await request(app)
        .delete(`/customers/${customer._id}`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBe('Customer has been deleted...');
    });

    it('Failed to delete customer', async () => {
      const res = await request(app)
        .delete(`/customers/${customer._id}`)
        .set({
          token: `Bearer ${accessToken}`,
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toBe('Customer not found!');
    });
  });
});
