import chai, { request } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import sinon from 'sinon';
import Database from '../src/database';

chai.use(chaiHttp);
const { expect } = chai;
let token = '';

describe('update-profile', () => {
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

  it('should update the profile', async () => {
    const user = {
      name: 'remy rwema',
      gender: 'male',
      birthdate: '12/2/2003',
      preferedlanguage: 'english',
      preferedcurrency: 'Euro',
      phone: '1234567890',
      address: '123 Test Street',
    };
    chai
      .request(app)
      .patch('/api/users/update')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(200);
      });
  });

  it('check the token', async () => {
    const invalidtoken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE5Y2IxZGM5LWRhYzYtNDQxZS1hYzE3LTk3YTc2N2NmYTZjNCIsImlhdCI6MTcxMjU4NjY5NSwiZXhwIjoxNzEyNTkzODk1fQ.zTfxiI19CNBgIG8QO6FsBiEnX6U81rmYF3W4Ea5yB20';
    const user = {
      name: 'remy rwema',
      gender: 'male',
      birthdate: '12/2/2003',
      preferedlanguage: 'english',
      preferedcurrency: 'Euro',
      phone: '1234567890',
      address: '123 Test Street',
    };
    chai
      .request(app)
      .patch('/api/users/update')
      .set('Authorization', `Bearer ${invalidtoken}`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(403);
      });
  });

  it('should return an error', async () => {
    const user = {
      name: 'remy rwema',
      gender: 'male',
      birthdate: '12/2/2003',
      preferedlanguage: 'english',
      preferedcurrency: 'Euro',
      phone: '1234567890',
      address: '123 Test Street',
    };
    const updateStub = sinon
      .stub(Database.User, 'update')
      .throws(new Error('Database error'));
    chai
      .request(app)
      .patch('/api/users/update')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .end((err, res) => {
        updateStub.restore();
        expect(res.status).to.equal(500);
      });
  });
});
