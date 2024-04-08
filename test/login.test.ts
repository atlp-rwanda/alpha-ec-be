import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { checkUserCredentials } from '../src/controllers/loginController';
import sendEmail from '../src/utils/sendEmail';
import sinon, { SinonStubbedInstance } from 'sinon';
import Database from '../src/database';
import bcrypt from 'bcrypt';
import { handleCookies } from '../src/utils/handleCookie';
import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../src/utils/response';
import dotenv, { config } from 'dotenv';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);
chai.should();
dotenv.config();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('testing Login API', () => {
  describe('test if user credentials are valid', () => {
    // in case of valid credentials and user is found in database

    it('it should return status code of 200', function (done) {
      const user = {
        email: 'test1@example.com',
        password: '1111@aa',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('OTP Email sent');
          done();
        });
    }).timeout(5000);

    it('it should return status code of 400 with User forget to provide at least one special character', function (done) {
      this.timeout(5000);

      const user = {
        email: 'tryme@example.com',
        password: '11111aa',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');

          done();
        });
    });

    it('it should return status code of 400 with providing password,having no letter and special characters and langth is minimum', done => {
      const user = {
        email: 'tryme@example.com',
        password: 'Passwo',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    // user having password without one number

    it('it should return status code of 400 with user having password without at least one number ', done => {
      const user = {
        email: 'trymeexample.com',
        password: 'Password!',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should return status code 400 and "User not found" message if user is not found', function (done) {
      const user = {
        email: 'nonexistent@example.com',
        password: 'nonexistentpassword',
      };

      // Mocking the Database.User.findOne method to simulate user not found scenario
      const findOneStub = sinon.stub(Database.User, 'findOne');
      findOneStub.resolves(null); // Simulating user not found

      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');

          // Restoring the stub
          findOneStub.restore();
          done();
        });
    });

    it('should return status code 200 and user object if user is found and password is correct', function (done) {
      const user = {
        email: 'existing@example.com',
        password: 'correctpassword',
      };
      const mockUser: any = {
        _attributes: {},
        dataValues: {
          id: 1,
          email: 'existing@example.com',
          password: bcrypt.hashSync('correctpassword', 10),
        },
        _creationAttributes: {},
        isNewRecord: false,
      };

      const findOneStub = sinon.stub(Database.User, 'findOne');
      findOneStub.resolves(mockUser);
      const compareStub = sinon.stub(bcrypt, 'compare');
      compareStub.resolves(true);

      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');

          findOneStub.restore();
          compareStub.restore();
          done();
        });
    });

    it('it should return status code of 400 with user having invalid email', function (done) {
      this.timeout(5000);
      const user = {
        email: 'tryme@example.com',
        password: 'Password2#',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');

          done();
        });
    });

    it('expecting error for password credentials without at least one letter', done => {
      const user = {
        email: 'tryme@example.com',
        password: '1234562@',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('handling error returned by database', done => {
      new Error('Database error');
      checkUserCredentials(
        'test1@example.com',
        '1111@aa',
        (err: any, user: any) => {
          expect(user).to.be.undefined;
          done();
        }
      );
    });
    it('should send email with OTP code', done => {
      const sendEmailStub = sinon.stub(sendEmail as any);
      sendEmailStub.callsFake(async () => {
        return Promise.resolve(undefined);
      });

      const user = {
        email: 'test1@example.com',
        password: '1111@aa',
      };

      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('OTP Email sent');
          done();
        });
    });

    it('should handle email sending failure', done => {
      const sendEmailStub = sinon.stub(sendEmail as any);
      sendEmailStub.callsFake(async () => {
        throw new Error('Failed to send email');
      });

      const user = {
        email: 'test1@example.com',
        password: '1111@aa',
      };

      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });
});

//End of testing

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
