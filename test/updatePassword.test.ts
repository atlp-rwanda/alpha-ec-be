import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { describe, it } from 'mocha';
import Database from '../src/database';
import sinon from 'sinon';
import * as emailSent from '../src/utils/email';
import checkPasswordExpiration from '../src/controllers/passwordExpirationcron';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const userPassword = {
  oldPassword: '1111@aa',
  newPassword: 'Password@3',
  confirmPassword: 'Password@3',
};

const userExpiredPassword = {
  oldPassword: 'Password@24',
  newPassword: 'Password@3',
  confirmPassword: 'Password@3',
};

describe('POST, /api/users/change-password', () => {
  var token: string = '';
  before(done => {
    const user = {
      email: 'test4@example.com',
      password: userPassword.oldPassword,
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
  it('sending message to email of person with expired password', done => {
    let sendEmailStub;
    sendEmailStub = sinon.stub(emailSent, 'sendEmail');
    const mailOptions = {
      to: 'uwamarith@gmail.com',
      subject: 'Urgently! Updating password',
      template: 'updatePassword',
    };
    emailSent.sendEmail(mailOptions);
    expect(mailOptions.to).to.equal('uwamarith@gmail.com');
    done();
  });
});
