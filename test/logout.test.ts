import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';
import { mockReq, mockRes } from 'sinon-express-mock';
import Database from '../src/database';
import sinon from 'sinon';
import logoutController from '../src/controllers/logoutController';
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

chai.use(chaiHttp);
chai.should();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let token: string = '';
describe('Logout Api Test', () => {
  before(done => {
    const user = {
      email: 'test5@example.com',
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

  it('Should logout a user', function (done) {
    chai
      .request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');

        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should return you are not authorized ', function (done) {
    this.timeout(5000);
    chai
      .request(app)
      .post('/api/users/logout')
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Should return Token already blacklisted', function (done) {
    this.timeout(5000);
    chai
      .request(app)
      .post('/api/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should handle internal server errors', done => {
    const req = mockReq({
      originalUrl: '/api/users/logout',
    });
    const res = mockRes();

    sinon.stub(Database.Logout, 'build').throws(new Error('Database error'));

    logoutController(req, res)
      .then(() => {
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith(sinon.match.any, 'Internal Server Error')).to
          .be.false;
        done();
      })
      .catch(error => {
        done(error);
      });
  }).timeout(5000);
});
