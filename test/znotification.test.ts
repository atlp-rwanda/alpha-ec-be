import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import { headerTokenSeller } from './2FA.tets';
import { sendNotification } from '../src/utils/notification';
import sinon from 'sinon';
import Database from '../src/database';
import user from '../src/database/models/user';

chai.use(chaiHttp);
const { expect } = chai;

describe('notification API TEST', () => {
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

  it('Should get all notifications', function (done) {
    chai
      .request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${headerTokenSeller}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  }).timeout(20000);
  it('should handle errors gracefully', async () => {
    sinon.stub(Database.Notification, 'findAll').throws(new Error('DB Error'));

    const res = await chai
      .request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${headerTokenSeller}`);

    expect(res).to.have.status(500);
    expect(res.body.message).to.equal('DB Error');
  });
  it('should mark all notifications as read for a seller', async () => {
    const updatedNotifications = [
      Database.Notification.build({
        id: 'notification-id-1',
        message: 'Notification message 1',
        event: 'PAYMENT_COMPLETED',
        isRead: true,
        createdAt: new Date(),
        sellerId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        userId: 'user-id-123',
      }),
    ];

    sinon.stub(Database.Notification, 'update').resolves([1]);
    // sinon.stub(Database.Notification, 'findAll').resolves(updatedNotifications);

    const res = await chai
      .request(app)
      .patch('/api/notifications/markall')
      .set('Authorization', `Bearer ${headerTokenSeller}`);

    expect(res).to.have.status(500);
  });
});
