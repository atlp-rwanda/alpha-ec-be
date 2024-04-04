import chai from 'chai';
import sinon, { SinonStub, SinonSandbox } from 'sinon';
import chaiHttp from 'chai-http';
import { describe, it, beforeEach, afterEach } from 'mocha';
import app from '../src/app';
import passport from '../src/config/passport-setup';
import { userToken } from '../src/utils/tokenGenerate';
import { handleGoogleCallback } from '../src/controllers/authController';

chai.use(chaiHttp);
const { expect } = chai;

describe('Google Authentication', () => {
 let req: any,
    res: any,
    next: any,
    authenticateStub: SinonStub<any[], any>,
    userTokenStub: SinonStub<any[], any>;

 let sandbox: SinonSandbox;

 beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
    sandbox = sinon.createSandbox();
    authenticateStub = sandbox.stub(passport, 'authenticate');

    userTokenStub = sandbox.stub().returns(Promise.resolve('sample_token'));
 });

 afterEach(() => {
    sandbox.restore();
 });

 it('Handles Google Login Failure', (done) => {
    authenticateStub.callsFake((strategy, callback) => {
      callback(new Error('Authentication failed'), null);
    });

    chai
      .request(app)
      .get('/api/users/google-auth')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(authenticateStub.calledOnce).to.be.true;
        done();
      });
 });


 it('Handles User not found', done => {
  const user = null;
  const err = null;
  authenticateStub.callsArgWith(1, err, user);

  handleGoogleCallback(req, res);

  expect(res.status.calledWith(401));
  expect(res.json.calledWith({ error: 'User not found' }));
  done();
});

 it('generate token', (done) => {
    const generatedToken = userToken(
      '92c472c8-406a-4a89-898f-46965830316a',
      'nadinefiona9@gmail.com'
    );
    expect(typeof generatedToken).to.equal('string');
    done();
 });

 it('should handle Google authentication failure', (done) => {
  authenticateStub.callsFake((strategy, callback) => {
    callback(new Error('Authentication failed'), null);
  });

  handleGoogleCallback(req, res);

  expect(res.status.calledWith(500));
  expect(res.json.calledWith({ error: 'Failed to authenticate with Google' }));

  done();
});

it('should generate token for valid user', async () => {
  const user = { id: '123', email: 'test@test.com' };
  authenticateStub.callsArgWith(1, null, user);

  handleGoogleCallback(req, res);

  await new Promise((resolve) => process.nextTick(resolve));

  expect(res.status.calledWith(200));
  expect(res.json.calledWith({ token: 'sample_token' }));
});
});
