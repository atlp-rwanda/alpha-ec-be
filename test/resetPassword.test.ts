import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { checkUserCredentials } from '../src/controllers/loginController';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYyNjkzNzA5LWQ1MzAtNGEwYy1iNjU1LTYxYmJkNjQ3YmFkZiIsImlhdCI6MTcxMjU5ODEyNCwiZXhwIjoxNzEyNjA1MzI0fQ.4m9Vh0L9YWxMFqVV1ma7fXUitjR6qKjc3RIqDm4pbpA';

describe('forgotPassword', () => {
  it('should send a password reset link to user', done => {
    const user = {
      email: 'henryfils98@gmail.com',
    };

    chai
      .request(app)
      .post('/api/users/forgot-password')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(
          'Password reset link sent successfully!'
        );
        done();
      });
  });
});

describe('resetPassword', () => {
  it('should reset the password', done => {
    const user = {
      password: '12!Testing',
      confirmPassword: '12!Testing',
    };

    chai
      .request(app)
      .patch('/api/users/reset-password/:token')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Password reset token is invalid.');
        done();
      });
  });
});
