'use strict';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('NODE_ENV !== test');
}

const config = require('config');
const promisify = require('es6-promisify');
const expect = require('expect');
const request = require('request-promise').defaults({
  //encoding: null,
  simple: false,
  resolveWithFullResponse: true,
  json: true
});

const server = require('../server');
const User = require('../models/user');

const fixtures = require('./fixtures/users');




describe('Users test', () => {


  describe('GET request testing', () => {
    before(async () => {
      await promisify(cb => User.remove({}, cb))();
      await promisify(cb => User.collection.insert(fixtures, cb))();
    });

    it('request /users should return a list of users with the correct headings and count of users', async () => {
      let response = await request('http://localhost:3000/users');
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.length).toBe(2);
    });

    it('request /users/:userId should a correct user with the correct headings', async () => {
      let response = await request(`http://localhost:3000/users/${fixtures[0]._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');

      let user = Object.assign({}, fixtures[0]);
      user.id = user._id.toString();
      delete user._id;

      expect(response.body).toEqual(user);
    });

    it('request /users/notExistId should return 404 statusCode', async () => {
      let response = await request(`http://localhost:3000/users/notExistId`);
      expect(response.statusCode).toBe(404);
    });

    it('request /users should return [] if no users in collection', async () => {
      await User.remove({}); // Удаление всех users из коллекции
      let response = await request('http://localhost:3000/users');
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toEqual([]);
    });

  });


  describe('POST request testing', () => {
    before(async () => {
      await promisify(cb => User.remove({}, cb))();
      await promisify(cb => User.collection.insert(fixtures, cb))();
    });

    it('Fields are not unique. Should return 400 and errors list', async () => {
      let newUser = Object.assign({},fixtures[0]);
      delete newUser._id;

      let response = await request.post('http://localhost:3000/users', {body: newUser});
      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect('errors' in response.body).toExist();
    });

    it('Required fields are not filled.Should return 400 and errors list', async () => {
      let response = await request.post('http://localhost:3000/users', {body: {}});
      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect('errors' in response.body).toExist();
    });



    it('Required fields are filled with unique values. Should return new user and 200 statusCode', async () => {
      let newUser = {
        email: 'new@email.com',
        displayName: 'new'
      };

      let response = await request.post('http://localhost:3000/users', {body: newUser});
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');

      delete response.body.id;
      expect(response.body).toEqual(newUser);
    })
  });

  describe('PATCH request testing', () => {
    before(async () => {
      await promisify(cb => User.remove({}, cb))();
      await promisify(cb => User.collection.insert(fixtures, cb))();
    });

    it('should return 404 if there is no user with a specified id', async () => {
      let response = await request.patch('http://localhost:3000/users/notExist', {body: fixtures[0]});
      expect(response.statusCode).toBe(404);
    });

    it('should return 400 if no request body', async () => {
      let response = await request.patch(`http://localhost:3000/users/${fixtures[0]._id}`);
      expect(response.statusCode).toBe(400);
      let response2 = await request.patch(`http://localhost:3000/users/${fixtures[0]._id}`, {body: {}});
      expect(response2.statusCode).toBe(400);
    });

    it('should return 400, if exists  user with such data', async () => {
      let response = await request.patch(`http://localhost:3000/users/${fixtures[0]._id}`, {body: fixtures[1]});
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect('errors' in response.body).toExist();
    });
  });

  describe('DELETE request testing', () => {
    before(async function () {
      await promisify(cb => User.remove({}, cb))();
      await promisify(cb => User.collection.insert(fixtures, cb))();
    });

    it('should return 404 if there is no user with a specified id', async ()=> {
      let response = await request.del('http://localhost:3000/users/notExist');
      expect(response.statusCode).toBe(404);
    });

    it('should delete user with specifed userId and return 200 statusCode', async ()=> {
      let response = await request.del(`http://localhost:3000/users/${fixtures[0]._id}`);
      expect(response.statusCode).toBe(200);

      // Должен остаться 1 пользователь
      let response2 = await request('http://localhost:3000/users');
      expect(response2.body.length).toBe(1);
    });

  });

  after(() => {
    server.shutdown();
  })


});


