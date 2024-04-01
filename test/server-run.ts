/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import app from '../src/app';
import { addition } from '../src/controllers/dummyController';
import Databases from '../src/database/db';

chai.use(chaiHttp);
const { expect } = chai;

describe('API Tests', () => {
  it('should return Welcome to the API!👋🏽👋🏽', done => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.body.message).to.equal('Welcome to the API!👋🏽👋🏽');
        done();
      });
  });
  it('get all dummies with 200 ', done => {
    chai
      .request(app)
      .get('/api/dummy')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
  it('get all dummies with 500 ', done => {
    const { Dummy } = Databases;

    sinon.stub(Dummy, 'findAll').throws(new Error('Internal server error'));
    chai
      .request(app)
      .get('/api/dummy')
      .end((err, res) => {
        (Dummy.findAll as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });

  it('should return the sum of two positive numbers', () => {
    expect(addition(1, 2)).to.equal(3);
});
});

