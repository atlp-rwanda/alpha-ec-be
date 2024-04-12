import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { describe, it } from 'mocha';
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const userPassword = {
  oldPassword: '1111@aa',
  newPassword: 'Password@3',
  confirmPassword: 'Password@3',
};

describe('POST, /api/users/change-password', () => {
  var token: string = '';

  before(done => {
    const user = {
      email: 'test1@example.com',
      password: userPassword.oldPassword,
    };
    chai
      .request(app)
      .post('/api/users/login')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        token = res.body.data;
        done();
      });
  });
  it('it should return status code of 200 for successfully change password', done => {
    chai
      .request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Password changed successfully');
        done();
      });
  });
  it('when old password is not the same as the one stored in database', done => {
    chai
      .request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.body.message).to.equal('Invalid credentials');
        done();
      });
  });
  it('in case of invalid or no token', done => {
    token = '';
    chai
      .request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('You are not authorized');
        done();
      });
  });
});
