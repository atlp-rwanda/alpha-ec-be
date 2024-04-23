import chaiHttp from 'chai-http';
import app from '../src/app';
import chai from 'chai';

chai.use(chaiHttp);
const { expect } = chai;

let token = '';

describe('USER ACCOUNT STATUS TEST', () => {
  before(done => {
    const user = {
      email: 'test2@example.com',
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

  it('Should return User not found', done => {
    const id = 'd554e533-a94a-4dd0-b131-efc32bb9b1d3';
    const payload: string[] = [
      'Repeated violation of terms of service',
      'Not following usage policies',
      'Harrassment',
    ];
    chai
      .request(app)
      .post(`/api/users/${id}/account-status`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('User not found');
        done();
      });
  });

  it('At least one reason is required to Suspend an account', done => {
    const id = 'c19de6bc-2f6c-499e-9399-f010d656b4f9';
    const payload: string[] = [];
    chai
      .request(app)
      .post(`/api/users/${id}/account-status`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal(
          'At least one reason is required to Suspend an account.'
        );
        done();
      });
  });

  it('should return code 500', done => {
    const id = 'c19de6bc-2f6c-499e-9399-f010d656b4fz';
    const payload: string[] = [
      'Repeated violation of terms of service',
      'Not following usage policies',
      'Harrassment',
    ];
    chai
      .request(app)
      .post(`/api/users/${id}/account-status`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Account should be Suspended successfully!!', done => {
    const id = 'c19de6bc-2f6c-499e-9399-f010d656b4f9';
    const payload: string[] = [
      'Repeated violation of terms of service',
      'Not following usage policies',
      'Harrassment',
    ];
    chai
      .request(app)
      .post(`/api/users/${id}/account-status`)
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          'Status has been updated to SUSPENDED'
        );
        done();
      });
  }).timeout(8000);

  it('Account should be Activated successfully!!', done => {
    const id = 'c19de6bc-2f6c-499e-9399-f010d656b4f9';

    chai
      .request(app)
      .post(`/api/users/${id}/account-status`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Status has been updated to ACTIVE');
        done();
      });
  }).timeout(8000);
});
