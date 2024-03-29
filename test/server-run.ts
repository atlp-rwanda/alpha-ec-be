import chai from 'chai';

import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';

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
});
