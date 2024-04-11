import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import Database from '../src/database';
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('POST, /api/users/change-password', () => {
  it('it should return status code of 200', async () => {
    const userPassword = {
      oldPassword: '1111@aa',
      newPassword: 'Password@3',
      confirmPassword: 'Password@3',
    };

    const user = await chai.request(app).post('/api/users/login').send({
      email: 'test1@example.com',
      password: userPassword.oldPassword,
    });

    const Token: string = user.body.data;

    chai
      .request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${Token}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Password changed successfully');
      });
  });
  it('when old password is not the same as the one stored in database', async () => {
    const userPassword = {
      oldPassword: '1111aa',
      newPassword: 'Password@31',
      confirmPassword: 'Password@31',
    };

    const user = await chai.request(app).post('/api/users/login').send({
      email: 'test1@example.com',
      password: '1111@aa',
    });

    const Token: string = user.body.data;

    chai
      .request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${Token}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.body.message).to.equal('Invalid credentials');
      });
  });
  it('in case of invalid or no token', async () => {
    const userPassword = {
      oldPassword: '1111@aa',
      newPassword: 'Password@3',
      confirmPassword: 'Password@3',
    };
    const user = await chai.request(app).post('/api/users/login').send({
      email: 'test1@example.com',
      password: '1111@aa',
    });

    const Token: string = user.body.data;

    chai
      .request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${Token}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Unauthorized');
      });
  });
});
