import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { expect } from 'chai';

chai.use(chaiHttp);

describe('verifyOTP', () => {
  let token: string;

  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login')
      .send({ email: 'user@example.com', password: 'password' });
    token = res.body.token;
  });

  it('it should handle error in ', async () => {
    const verificationCode = 'validOTP';
    const cookie = `token=${token}`;

    const res = await chai
      .request(app)
      .post('/api/users/login/verify')
      .set('Cookie', cookie)
      .send({ verificationCode });
    expect(res.status).to.equal(403);
    expect(res.body.message).to.equal('OTP not validated');
  });

  it('should return 403 and "Login required" message if no cookies are found', async () => {
    const res = await chai
      .request(app)
      .post('/api/users/login/verify')
      .send({ verificationCode: 'validOTP' });
    expect(res.status).to.equal(403);
    expect(res.body.message).to.equal('Login required');
  });
});
