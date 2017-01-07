'use strict';

console.log(process.env.NODE_ENV);
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

const oid = require('../utils/oid');
const fixtures = require('./fixtures/users');


describe('Users test', () => {


  describe('GET request testing', () => {
    before(async() => {
      // Удаление  коллекции users
      await promisify(cb => User.collection.drop(cb))();
      // Создание фикстур
      await User.create(fixtures);
    });

    it('request /users should return a list of users with the correct headings and count of users', async() => {
      let response = await request('http://localhost:3000/users');
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body.length).toBe(2);
    });

    it('request /users/:userId should a correct user with the correct headings', async() => {
      let response = await request(`http://localhost:3000/users/${oid('first')}`);
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');

      let user = Object.assign({}, fixtures[0]);
      user.id = user._id;
      delete user._id;

      expect(response.body).toEqual(user);
    });

    it('request /users/notExistId should return 404 statusCode', async() => {
      let response = await request(`http://localhost:3000/users/notExistId`);
      expect(response.statusCode).toBe(404);
    });

    it('request /users should return [] if no users in collection', async() => {
      await User.remove({}); // Удаление всех users из коллекции
      let response = await request('http://localhost:3000/users');
      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
      expect(response.body).toEqual([]);
    });

  });


  describe('POST request testing', () => {
    before(async() => {
      // Удаление  коллекции users
      await promisify(cb => User.collection.drop(cb))();
      // Создание фикстур
      await User.create(fixtures);
    });

    it('Fields are not unique.Should return 400 and errors list', async () => {

      let response = await request.post('http://localhost:3000/users', {body: {email : 'masha@gmail.com', displayName: 'masha'}});
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



    it('Required fields are filled with unique values. Should return new user and 200 statusCode', async() => {
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


  after(() => {
    server.shutdown();
  })


});


