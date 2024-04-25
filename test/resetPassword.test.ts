//
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Database from '../src/database';
import sinon from 'sinon';
import app from '../src/app';

// Now you can use userStub in place of an actual Database.User instance

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let token = '';

describe('forgotPassword', () => {
  before(done => {
    const user = {
      email: 'test6@example.com',
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
      email: 'test6@example.com',
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
  it('should handle error during password reset', done => {
    const updateStub = sinon
      .stub(Database.User, 'findOne')
      .throws(new Error('Database error'));

    const user = {
      email: 'test1@example.com',
    };

    chai
      .request(app)
      .post('/api/users/forgot-password')
      .send(user)
      .end((err, res) => {
        updateStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);

        done();
      });
  });
});

describe('resetPassword', () => {
  it('should reset password and fail', done => {
    const password = '123!newPassword';
    const confirmPassword = '123!newPassword';

    const updateStub = sinon
      .stub(Database.User, 'findOne')
      .throws(new Error('Database error'));
    chai
      .request(app)
      .patch(`/api/users/reset-password/${token}`)
      .send({ password, confirmPassword })

      .end((err, res) => {
        updateStub.restore();
        console.log('the answer::::', res.body);
        expect(res).to.have.status(500);
        done();
      });
  });

  it('using expired token', done => {
    const password = '123!newPassword';
    const confirmPassword = '123!newPassword';
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q2QGV4YW1wbGUuY29tIiwiaWF0IjoxNzEzNjg4MDA3LCJleHAiOjE3MTM2ODg5MDd9.yiKIZUw7GupLkhVnNL1KzU53k9JzHuzsn-sOGK3TmVk';
    chai
      .request(app)
      .patch(`/api/users/reset-password/${expiredToken}`)
      .send({ password, confirmPassword })

      .end((err, res) => {
        expect(res).to.have.status(400);

        done();
      });
  });

  it('should reset password', done => {
    const password = '123!newPassword';
    const confirmPassword = '123!newPassword';
    chai
      .request(app)
      .patch(`/api/users/reset-password/${token}`)
      .send({ password, confirmPassword })

      .end((err, res) => {
        expect(res).to.have.status(200);

        done();
      });
  });
  it('it should return status code of 400 with user having password without at least one number ', done => {
    const password = '!newPassword';
    const confirmPassword = '!newPassword';
    chai
      .request(app)
      .patch(`/api/users/reset-password/${token}`)
      .send({ password, confirmPassword })

      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('should not reset password with invalid token', done => {
    const password = '123!newPassword';
    const confirmPassword = '123!newPassword';
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliMDM1NTAyLTFiYzUtNDIwZi04Zjg3LTA4ZmU1MmFkNDNiNCIsImlhdCI6MTcxMjg2OTIyMiwiZXhwIjoxNzEyODc2NDIyfQ.3csF_xrMtDaAQQrvybncMMXQ_AlTvR03ghtrzB_1BPk';
    chai
      .request(app)
      .patch(`/api/users/reset-password/${invalidToken}`)
      .send({ password, confirmPassword })

      .end((err, res) => {
        expect(res).to.have.status(400);

        done();
      });
  });
  it('Password reset token is invalid.', done => {
    const password = '123!newPassword';
    const confirmPassword = '123!newPassword';
    const invalidToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRjZWU1OWFmLWQwNDAtNDlmYS04YWM1LThhZTBiY2EwZDk3MiIsImlhdCI6MTcxMzk4NzkwNiwiZXhwIjoxNzEzOTk1MTA2fQ.aHlbROzOp-Cz3s8gVVryPt4f5ZtH06L_DhR4tn_wIfI';
    chai
      .request(app)
      .patch(`/api/users/reset-password/${invalidToken}`)
      .send({ password, confirmPassword })

      .end((err, res) => {
        console.log('::::', res.body);
        expect(res).to.have.status(400);

        done();
      });
  });
});
