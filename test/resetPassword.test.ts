import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Database from '../src/database';
import sinon from 'sinon';
import { mockReq, mockRes } from 'sinon-express-mock';
import app from '../src/app';
import {
  resetPassword,
  forgotPassword,
} from '../src/controllers/resetPasswordController';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Now you can use userStub in place of an actual Database.User instance

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let token = '';

describe('forgotPassword', () => {
  before(done => {
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
        expect(res.body).to.have.property('data');
        token = res.body.data;
        done();
      });
  });
  it('should send a password reset link to user', function (done) {
    this.timeout(5000);
    const user = {
      email: 'test1@example.com',
    };
    chai
      .request(app)
      .post('/api/users/forgot-password')
      .send(user)

      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should fail send a password reset link to user', done => {
    const user = {
      email: 'test@example.com',
    };

    chai
      .request(app)
      .post('/api/users/forgot-password')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'A user with this email does not exist.'
        );
        done();
      });
  });
  it('something went wrong', done => {
    const user = {
      email: 'test@example.com',
    };

    chai
      .request(app)
      .post('/api/users/forgot-password')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'A user with this email does not exist.'
        );
        done();
      });
  });
  // it('should handle error during password reset', async () => {
  //   const resetPasswordStub = sinon.stub().rejects(new Error('Mocked error'));

  //   sinon.replace(
  //     module,
  //     'resetPassword' as keyof NodeModule,
  //     resetPasswordStub
  //   );

  //   const user = {
  //     email: 'test1@example.com',
  //   };

  //   const response = await chai
  //     .request(app)
  //     .post('/api/users/forgot-password')
  //     .send(user);

  //   expect(response).to.have.status(500);
  //   expect(response.body.message).to.equal(
  //     'Something went wrong, please try again later.'
  //   );
  // });
  it('should handle internal server errors', done => {
    const req = mockReq({
      originalUrl: '/api//users/forgot-password',
    });
    const res = mockRes();

    sinon.stub(Database.User, 'build').throws(new Error('Database error'));

    forgotPassword(req, res)
      .then(() => {
        expect(res.status.calledWith(500)).to.be.true;
        expect(
          res.json.calledWith(
            sinon.match.any,
            'Something went wrong, please try again later.'
          )
        ).to.be.true;
        done();
      })
      .catch(error => {
        done(error);
      });
  });
});

// describe('resetPassword', () => {
//   it('should reset password successfully', (done) => {
//      const token = '';
//      const password = 'newPassword';
//      const confirmPassword = 'newPassword';

//      // Mock jwt.verify to return a decoded token
//      sinon.stub(jwt, 'verify').resolves({ id: '1', exp: Date.now() / 1000 + 3600 });

//      // Mock Database.User.findOne to return a user
//      sinon.stub(Database.User, 'findOne').resolves({
//        update: sinon.stub().resolves(),
//      });

//      // Mock bcrypt.hash to return a hashed password
//      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');

//      chai.request(app)
//        .patch(`/users/reset-password/${token}`)
//        .send({ password, confirmPassword })
//        .end((err, res) => {
//          expect(res).to.have.status(200);
//          expect(res.body.message).to.equal('Password reset and Logged in successfully!');
//          done();
//        });
//   });
//  });

describe('resetPassword', () => {
  it('should reset password successfully', done => {
    console.log(token);
    const password = '123!newPassword';
    const confirmPassword = '123!newPassword';

    // // Mock jwt.verify to return a decoded token
    // sinon
    //   .stub(jwt, 'verify')
    //   .resolves({ id: '1', exp: Date.now() / 1000 + 3600 });

    // // Mock Database.User.findOne to return a user
    // const userMock = {
    //   id: '1',
    //   update: sinon.stub().resolves(), // Stubbing update method
    // };
    // sinon.stub(Database.User, 'findOne').resolves(userMock as any);

    chai
      .request(app)
      .patch(`/users/reset-password/${token}`)
      .send({ password, confirmPassword })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          'Password reset and Logged in successfully!'
        );
        done();
      });
  });
});
