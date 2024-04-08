import chai from 'chai';
import sinon, { SinonAssert, SinonMatcher } from 'sinon';
import Database from '../src/database';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../src/app';
import { userValidationSchema } from '../src/validations';
import { createUser } from '../src/controllers/userController';
import { Request, Response } from 'express';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

chai.use(chaiHttp);
const { expect } = chai;
dotenv.config();

describe('USER API TEST', () => {
  it('should create a new user', done => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: '11111@aa',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User created successfully!');
        done();
      });
  });

  it('should return validation errors if required fields are missing', done => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      // Missing phone, address, and password
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should return an error if the email is already in use', done => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: '11111@aa',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(
          'A user with this email already exists.'
        );
        done();
      });
  });

  it('password should contain at least one letter', done => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: '1234567!',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Validation Errors!');
        done();
      });
  });
  it('password should contain at least one number', done => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: 'aaaaaaa!',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Validation Errors!');
        done();
      });
  });
  it('password should contain at least one special character (@#$%^&+=!)', done => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: '1aaaaaaa',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Validation Errors!');
        done();
      });
  });
  it('password should contain at least 8', done => {
    const user = {
      name: 'Test User',
      email: 'testuser@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: 'aaa1@',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Validation Errors!');
        done();
      });
  });

  it('should handle server errors during user creation', function (done) {
    const validateStub = sinon
      .stub(userValidationSchema, 'validate')
      .throws(new Error('Validation error'));

    const user = {
      name: 'Test User',
      email: 'testas@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: '11111@aa',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        validateStub.restore();

        expect(res.statusCode).to.equal(500);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should handle server errors during user creation', function (done) {
    const saveStub = sinon
      .stub(Database.User.prototype, 'save')
      .throws(new Error('Database error'));

    const user = {
      name: 'Test User',
      email: 'testas@example.com',
      phone: '1234567890',
      address: '123 Test Street',
      password: '11111@aa',
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(user)
      .end((err, res) => {
        saveStub.restore();

        expect(res.statusCode).to.equal(500);
        expect(res.body).to.have.property('message');
        done();
      });
  });
});
