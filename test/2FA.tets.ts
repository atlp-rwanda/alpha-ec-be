import chai, { expect } from 'chai';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import { DataInfo } from '../src/controllers/OTPcontroller';
import {
  verifyToken,
  signToken,
  userToken,
  decodeToken,
  findUsername,
} from '../src/utils/tokenGenerate';
import { verifyOtp } from '../src/controllers/OTPcontroller';
import sinon from 'sinon';
import Database from '../src/database';

chai.use(chaiHttp);

export let headerTokenSeller: string = '';
export let headerToken: string = '';
export let verifyTkn: string = '';

describe('user Signin controller and passport', () => {
  it('Login end point test', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'test2@example.com',
        password: '1111@aa',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        headerToken = res.body.data;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Login s seller user point test', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'test3@example.com',
        password: '1111@aa',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        verifyTkn = res.body.data;
        expect(res).to.have.status(201);
        done();
      });
  }).timeout(20000);

  it('Email sent successfully', done => {
    chai
      .request(app)
      .post('/api/users/login')
      .send({
        email: 'test3@example.com',
        password: '1111@aa',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        verifyTkn = res.body.data;
        expect(res.body.message).to.equal(
          'Verify OTP sent to your email to continue'
        );
        done();
      });
  }).timeout(10000);

  it('should Validate otp input', async () => {
    let otpCode: string = '';

    // Define the callback function for verifying the token
    const resultOtpToken: jwt.VerifyCallback = async (
      err: jwt.VerifyErrors | null,
      decoded: string | jwt.Jwt | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        throw new Error('Token verification failed');
      }
      const info = decoded as DataInfo;
      otpCode = info.body.otp;
      return info;
    };

    await verifyToken(verifyTkn, resultOtpToken);

    chai
      .request(app)
      .post(`/api/users/verify/${verifyTkn}`)
      .send({ otp: otpCode })
      .end(async (err, res) => {
        headerTokenSeller = res.body.data;

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Login seller successful');
        expect(res.body.token).to.be.undefined;
      });
  });

  it('should return 404 for invalid OTP', done => {
    chai
      .request(app)
      .post(`/api/users/verify/${verifyTkn}`)
      .send({ otp: '' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Invalid OTP');
        done();
      });
  });

  it('should return 401 for wrong OTP entered', done => {
    chai
      .request(app)
      .post(`/api/users/verify/${verifyTkn}`)
      .send({ otp: 'wrongOTP' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Wrong OTP entered');
        done();
      });
  });
  it('should Return Internal server error', done => {
    const validOtpToken = '123456';
    const obtainedOtpToken = validOtpToken;

    chai
      .request(app)
      .get(`/api/users/verify-otp/${validOtpToken}`)
      .send({ otp: obtainedOtpToken })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(500);
        expect(res.body.message).to.equal(
          'An error occurred during verification.'
        );
        done();
      });
  });

  // it('should verify a valid OTP', done => {
  //   const token = signToken({
  //     email: 'test@example.com',
  //     id: '',
  //     otp: ''
  //   }, '15m');

  //   const user = {
  //     email: 'test@example.com',
  //     verified: false,
  //     save: sinon.stub().resolves(),
  //   };
  //   const findOneStub = sinon
  //     .stub(Database.User, 'findOne')
  //     .resolves(user as any);

  //   chai
  //     .request(app)
  //     .get(`api/users/verify-otp/` + token)
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(200);
  //       expect(res.body.message).to.equal('OTP successfully verified.');
  //       done();
  //     });
  // });

  // it('should return 404 for an invalid OTP', done => {
  //   const invalidToken =''
  //   chai
  //     .request(app)
  //     .get(`api/users/verify-otp/${invalidToken}`)
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       expect(res).to.have.status(404);
  //       expect(res.body.message).to.equal('Invalid or expired OTP.');
  //       done();
  //     });
  // });
  it('user should asign token', done => {
    const token = userToken('1', 'test@gmail.com');
    expect(token).to.be.a('string');
    done();
  });

  it("should return the user's id", done => {
    const response = decodeToken(headerToken);
    expect(response).to.be.a('string');
    done();
  });
  it('should return null on token', done => {
    const response = decodeToken('header');
    expect(response).to.be.null;
    done();
  });
  it('assign token to user', done => {
    const token = signToken(
      {
        id: '1',
        email: 'test@gmail.com',
        otp: '123456',
      },
      'secret'
    );
    expect(token).to.be.a('promise');
    done();
  });
  it("should return the user's name", done => {
    const response = findUsername('d95193b1-5548-4650-adea-71f622667095');
    expect(response).to.be.a('promise');
    done();
  });
});
