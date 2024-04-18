import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import loginController from '../src/controllers/loginController';
import sinon from 'sinon';
import Database from '../src/database';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);
chai.should();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('testing Login API', () => {
  describe('test if user credentials are valid', () => {
    // in case of valid credentials and user is found in database

    it('it should return status code of 200', done => {
      const user = {
        email: 'test2@example.com',
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
    }).timeout(10000);

    it('should be told to verify before login (401)', done => {
      const user = {
        email: 'test1@example.com',
        password: '1111@aa',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal(
            'Please check your email to verify your account before login.'
          );
          done();
        });
    }).timeout(10000);

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

    it('it should return status code of 400 with user having password without at least one number ', async() => {
      const user = {
        email: 'trymeexample.com',
        password: 'Password!',
      };
      const res = await chai.request(app).post('/api/users/login').send(user);

  // Asserting response properties
  expect(res).to.have.status(400);
  expect(res.body).to.have.property('message');
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

    it('expecting error for password credentials without at least one letter', function(done)  {
      this.timeout(10000);
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
    it('in case of any error during finding user in database', async () => {
      const stubOnDatabase = sinon
        .stub(Database.User, 'findOne')
        .throws(new Error());
      const user = {
        email: 'test1@example.com',
        password: '1111@aa',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          stubOnDatabase.restore();
          expect(res).to.have.status(500);
        });
    });
    it('it should return This account is SUSPENDED', done => {
      const user = {
        email: 'test9@example.com',
        password: '1111@aa',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('This account is SUSPENDED!!');
          done();
        });
    }).timeout(10000);
    it('expecting error for password credentials without at least one letter', done => {
      const user = {
        email: 'uwamarith@gmail.com',
        password: 'Password@24',
      };
      chai
        .request(app)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          console.log(res.body.message);
          expect(res.body.message).to.equal(
            'Your password has expired. Please check your email to update it.'
          );
          done();
        });
    });
  });
});

//End of testing

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
