import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import verifyOTP from '../src/controllers/verifyController';

describe('verifyOTP', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return 200 and success message when OTP is successfully verified', async () => {
    const req = {
      body: {
        verificationCode: 'validOTP',
      },
      headers: {
        cookie: 'onloginToken=hashedToken; onloggingUserid=userId',
      },
    } as Request;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response;

    sinon.stub(bcrypt, 'compare').resolves(true);

    await verifyOTP(req, res);

    sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
    sinon.assert.calledWith(res.json as sinon.SinonStub, {
      message: 'OTP successfully verified',
    });
  });

  it('should return 500 and error message when OTP is not validated', async () => {
    const req = {
      body: {
        verificationCode: 'invalidOTP',
      },
      headers: {
        cookie: 'onloginToken=hashedToken; onloggingUserid=userId',
      },
    } as Request;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response;

    sinon.stub(bcrypt, 'compare').resolves(false);

    await verifyOTP(req, res);

    sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
    sinon.assert.calledWith(res.json as sinon.SinonStub, {
      status: 'Error!',
      data: null,
      message: 'OTP not validated',
    });
  });

  it('should return 403 when login is required', async () => {
    const req = {} as Request;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response;

    await verifyOTP(req, res);

    sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    sinon.assert.calledWith(res.json as sinon.SinonStub, {
      error: 'Login required',
    });
  });

  it('should return 500 and error message when an error occurs', async () => {
    const req = {
      body: {
        verificationCode: 'validOTP',
      },
      headers: {
        cookie: 'onloginToken=hashedToken; onloggingUserid=userId',
      },
    } as Request;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as unknown as Response;

    sinon.stub(bcrypt, 'compare').rejects(new Error('Some error occurred'));

    await verifyOTP(req, res);

    sinon.assert.calledWith(res.status as sinon.SinonStub, 500);
    sinon.assert.calledWith(res.json as sinon.SinonStub, {
      status: 'Error!',
      data: null,
      message: 'Some error occurred',
    });
  });
});
