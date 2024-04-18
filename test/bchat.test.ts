import { describe, it } from 'mocha';
import app from '../src/app';
import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import Database from '../src/database';
import sinon from 'sinon';

chai.use(chaiHttp);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const userPassword = {
  email: 'test4@example.com',
  password: '1111@aa',
};

describe('Socket testing', () => {
  var token: string = '';

  before(done => {
    const user = {
      email: 'test4@example.com',
      password: userPassword.password,
    };
    chai
      .request(app)
      .post('/api/users/login')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        token = res.body.data;
        done();
      });
  });

  it('Retriving all messages sent in chat application', done => {
    chai
      .request(app)
      .get('/api/chats')
      .set('Authorization', `Bearer ${token}`)
      .send(userPassword)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Messages retrieved successfully');
        done();
      });
  });

  it('should serve index.html', done => {
    chai
      .request(app)
      .get('/api/chatapp')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });

  it('in case of internal server error', done => {
    const stubOnDatabase = sinon
      .stub(Database.Chat, 'findAll')
      .throws(new Error());

    chai
      .request(app)
      .get('/api/chats')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        stubOnDatabase.restore();
        expect(res).to.have.status(500);
        done();
      });
  });
});
