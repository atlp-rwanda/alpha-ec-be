import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import Database from '../src/database';
import sinon from 'sinon';

chai.use(chaiHttp);
const { expect } = chai;

let tokenBuyer = '';
describe('buyer should login', () => {
  before(done => {
    const user = {
      email: 'j.mukunzi@alustudent.com',
      password: '11111@aa',
    };
    chai
      .request(app)
      .post('/api/users/login')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        tokenBuyer = res.body.data;
        done();
      });
  });
  it('POST WISHES with 404', done => {
    const productId = '20adb047-8102-494d-8a8a-7b50990bc770';

    const wishes = {
      productId,
    };
    chai
      .request(app)
      .post('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send(wishes)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });
  it('POST WISHES with 500', done => {
    const produId = '20adb047-8102-494d-8a8a-7b50990bc770';

    const wishes = {
      produId,
    };
    chai
      .request(app)
      .post('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send(wishes)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });
  it('POST WISHES', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;

    const wishes = {
      productId,
    };
    chai
      .request(app)
      .post('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send(wishes)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(201);
      });
  });
  it('get all wishes with status code of 200 ', done => {
    chai
      .request(app)
      .get('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Wishlist fetched successfully');
        done();
      });
  });
  it('get all wishes with 500 ', done => {
    const { Wishlist } = Database;

    sinon.stub(Wishlist, 'findAll').throws(new Error('Internal server error'));
    chai
      .request(app)
      .get('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .end((err, res) => {
        (Wishlist.findAll as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });

  it('post wish with status code of 200', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;

    const wishes = {
      productId,
    };
    chai
      .request(app)
      .post('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .send(wishes)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
      });
  });
  it('delete all wishes with 500', done => {
    const { Wishlist } = Database;

    sinon.stub(Wishlist, 'destroy').throws(new Error('Internal server error'));
    chai
      .request(app)
      .delete('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .end((err, res) => {
        (Wishlist.destroy as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });
  it('delete all wishes with status code of 200 ', done => {
    chai
      .request(app)
      .delete('/api/wishes')
      .set('Authorization', `Bearer ${tokenBuyer}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});
