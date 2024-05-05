import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import { sendNotification } from '../src/utils/notification';

chai.use(chaiHttp);
const { expect } = chai;
export let token: string = '';
let id = '';

describe('notification API TEST', () => {
  before(done => {
    const user = {
      email: 'test3@example.com',
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
  it('User should be authenticated', done => {
    chai
      .request(app)
      .get('/api/notifications')
      .send()
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should send notification', function (done) {
    this.timeout(10000);

    sendNotification('d290f1ee-6c54-4b01-90e6-d701748f0851', {
      message: 'test',
    }).then(res => {
      expect(res).to.equals(undefined);
      done();
    });
  }).timeout(10000);
  it('delete all notifications with status code of 200 ', done => {
    chai
      .request(app)
      .delete('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        401;
        done();
      });
  });
  let notificationId: string = '';

  it('Should get all notifications', function (done) {
    chai
      .request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should delete a notification', done => {
    chai
      .request(app)
      .delete('/api/notifications/' + id)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('notifications deleted');
        done();
      });
  }).timeout(5000);
});
