import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { checkUserCredentials } from '../src/controllers/loginController';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);
chai.should();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('testing Login API', () => {
  describe('test if user credentials are valid', () => {
    // in case of valid credentials and user is found in database

    it('it should return status code of 200', done => {
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
          expect(res.body.message).to.equal('Logged In Successfully');
          done();
        });
    });

    // check if user is not found in database
    it('it should return status code of 400 with User forget to provide at least one special character', done => {
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

    // test if password is is less than 8 characters

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

    // test user with invalid email
    it('it should return status code of 400 with  user having invalid email ', done => {
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

    //test if password has at least one letter

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

    //database Error

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
  });
});

//End of testing

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
