import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { verifyEmail } from '../src/controllers/userVerifyController';
import Database from '../src/database/index';
import { Request, Response } from 'express';
import { signToken, verifyToken } from '../src/utils';

chai.use(chaiHttp);
const { expect } = chai;

describe('USER EMAIL VERIFICATION', () => {
  it('should verify user email successfully', async () => {
    const token = signToken({ email: 'test@example.com' }, '15m');

    const req: Partial<Request> = {
      params: { token },
    };

    const res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };

    const user = {
      email: 'test@example.com',
      verified: false,
      save: sinon.stub().resolves(),
    };

    const findOneStub = sinon.stub().resolves(user);
    const User = {
      findOne: findOneStub,
    };

    Database.User = User as any;

    await verifyEmail(req as Request, res as Response);

    sinon.assert.calledWith(res.status as sinon.SinonSpy, 200);
    expect(user.verified).to.be.true;
    sinon.assert.calledWith(res.json as sinon.SinonSpy, {
      status: 'Success!',
      data: '',
      message: 'Email verified successfully! Login to continue...',
    });

    sinon.restore();
  });

  it('should return status 500 with expired token', async () => {
    const expiredToken = signToken({ email: 'test@example.com' }, '-1');

    const req: Partial<Request> = {
      params: { token: expiredToken },
    };

    const res: Partial<Response> = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };

    await verifyEmail(req as Request, res as Response);

    sinon.assert.calledWith(res.status as sinon.SinonSpy, 500);
    sinon.assert.calledWith(res.json as sinon.SinonSpy, {
      status: 'Error!',
      data: null,
      message: 'jwt expired',
    });

    sinon.restore();
  });
});

describe('JWT TOKEN GENERATION', () => {
  it('should generate a token with default expiration time of 2 hours', () => {
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
    } else {
      throw new Error('Invalid token or missing properties');
    }
  });
});
