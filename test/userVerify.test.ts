import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { verifyEmail } from '../src/controllers/userVerifyController';
import Database from '../src/database/index';
import { signToken, verifyToken } from '../src/utils';
import { mockReq, mockRes } from 'sinon-express-mock';
import app from '../src/app';
chai.use(chaiHttp);
const { expect } = chai;
describe('USER EMAIL VERIFICATION', () => {
  it('should verify user email successfully', done => {
    const token = signToken({ email: 'test@example.com' }, '15m');
    const user = {
      email: 'test@example.com',
      verified: false,
      save: sinon.stub().resolves(),
    };
    const findOneStub = sinon
      .stub(Database.User, 'findOne')
      .resolves(user as any);
    chai
      .request(app)
      .get('/api/users/verify-email/' + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(user.verified).to.be.true;
        expect(res.body.message).to.equal(
          'Email verified successfully! Login to continue...'
        );
        findOneStub.restore();
        done();
      });
  });
  it('should return status 500 with expired token', done => {
    const expiredToken = signToken({ email: 'test@example.com' }, '-1');
    const req = mockReq({ params: { token: expiredToken } });
    const res = mockRes();
    verifyEmail(req, res)
      .then(() => {
        sinon.assert.calledWith(res.status as sinon.SinonSpy, 500);
        sinon.assert.calledWith(res.json as sinon.SinonSpy, {
          status: 'Error!',
          data: null,
          message: 'jwt expired',
        });
        done();
        sinon.restore();
      })
      .catch(error => {
        done(error);
      });
  });
});
describe('JWT TOKEN GENERATION', () => {
  it('should generate a token with default expiration time of 2 hours', done => {
    const payload = { email: 'test@example.com' };
    const token = signToken(payload);
    const decodedToken = verifyToken(token) as {
      exp: number;
      iat: number;
    } | null;
    if (decodedToken && decodedToken.exp && decodedToken.iat) {
      const expiresIn = decodedToken.exp - decodedToken.iat;
      const expiresInHours = expiresIn / 3600;
      expect(expiresInHours).to.equal(2);
      done();
    } else {
      throw new Error('Invalid token or missing properties');
    }
  });
});
