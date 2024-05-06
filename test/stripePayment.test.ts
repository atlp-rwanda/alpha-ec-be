import chaiHttp from 'chai-http';
import app from '../src/app';
import chai from 'chai';
import Database from '../src/database';
import sinon, { SinonStub } from 'sinon';
import { logger } from '../src/utils';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

chai.use(chaiHttp);
const { expect } = chai;

let token = '';

describe('STRIPE PAYMENT TESTS', () => {
  before(done => {
    const user = {
      email: 'test10@example.com',
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

  let token2 = '';
  before(done => {
    const user2 = {
      email: 'test11@example.com',
      password: '1111@aa',
    };
    chai
      .request(app)
      .post('/api/users/login')
      .send(user2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        token2 = res.body.data;
        done();
      });
  });

  let token3 = '';
  before(done => {
    const user3 = {
      email: 'test12@example.com',
      password: '1111@aa',
    };
    chai
      .request(app)
      .post('/api/users/login')
      .send(user3)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        token3 = res.body.data;
        done();
      });
  });

  let productId = '';
  before(async () => {
    const product = await Database.Product.findAll();
    productId = product[0].id;
  });
  it('should first add products to cart', done => {
    const products = {
      productId,
      quantity: '2',
    };
    chai
      .request(app)
      .post(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res.body.message).to.equal('Product added to cart');
        done();
      });
  });

  let productId2 = '';
  before(async () => {
    const product = await Database.Product.findAll();
    productId2 = product[0].id;
  });
  it('should first add products to cart (2)', done => {
    const products = {
      productId: productId2,
      quantity: '2',
    };
    chai
      .request(app)
      .post(`/api/carts`)
      .set('Authorization', `Bearer ${token3}`)
      .send(products)
      .end((err, res) => {
        expect(res.body.message).to.equal('Product added to cart');
        done();
      });
  });

  it('should process checkout successfully', done => {
    chai
      .request(app)
      .post('/api/payment')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('message')
          .equal(
            'Checkout done!, Continue with the url to create Order and complete Payment'
          );
        expect(res.body).to.have.property('orderConfirmation');
        expect(res.body).to.have.property('Success_url');
        done();
      });
  }).timeout(8000);

  let paymentId2 = '';
  it('should process checkout successfully (2)', done => {
    chai
      .request(app)
      .post('/api/payment')
      .set('Authorization', `Bearer ${token3}`)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('message')
          .equal(
            'Checkout done!, Continue with the url to create Order and complete Payment'
          );
        expect(res.body).to.have.property('orderConfirmation');
        expect(res.body).to.have.property('Success_url');

        const cancelUrl = new URL(res.body.Cancel_url);

        paymentId2 = cancelUrl.searchParams.get('paymentIntentId') as string;

        done();
      });
  }).timeout(8000);

  it('should return Cart not found', done => {
    chai
      .request(app)
      .post('/api/payment')
      .set('Authorization', `Bearer ${token2}`)
      .end((err, res) => {
        expect(res.body.message).to.equal('Cart not found');
        done();
      });
  }).timeout(6000);

  it('get orders with 500 ', done => {
    const { Order } = Database;

    sinon.stub(Order, 'findAll').throws(new Error('Internal server error'));
    chai
      .request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        (Order.findAll as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });
  it('Should return error 500', function (done) {
    const findAllStub = sinon
      .stub(Database.Product, 'findAll')
      .throws(new Error('Database error'));
    chai
      .request(app)
      .post('/api/payment')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        findAllStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });
  it('should get order 404', done => {
    chai
      .request(app)
      .get(`/api/orders`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('Payment Completed Successfully', function (done) {
    const userId2 = '47748694-036a-42b7-b20f-f9268c0c1e20';
    const paymentId =
      'cs_test_a1Rq2S3I7ugwTJ8wbvEpkSxc62pPtVu2WRfNTBdYLeUpBG1T00tzjdpQGX';

    chai
      .request(app)
      .get('/api/successfull-pay')
      .query({ paymentId, user: userId2 })
      .end((err, res) => {
        expect(res.body.message).to.equal('Payment Completed Successfully!!');
        done();
      });
  }).timeout(5000);
  it('should get order 200', done => {
    chai
      .request(app)
      .get(`/api/orders`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should return product in stock not found', function (done) {
    const userId2 = '47748694-036a-42b7-b20f-f9268c0c1e20';
    const paymentId =
      'cs_test_a1Rq2S3I7ugwTJ8wbvEpkSxc62pPtVu2WRfNTBdYLeUpBG1T00tzjdpQGX';

    const findByPkStub = sinon
      .stub(Database.Product, 'findByPk')
      .resolves(null);

    chai
      .request(app)
      .get('/api/successfull-pay')
      .query({ paymentId, user: userId2 })
      .end((err, res) => {
        findByPkStub.restore();
        expect(res.body.message).to.equal('Cart not found');
        done();
      });
  }).timeout(5000);

  it('Should return product not found when creating product orders', function (done) {
    const userId2 = '47748694-036a-42b7-b20f-f9268c0c1e20';
    const paymentId =
      'cs_test_a1Rq2S3I7ugwTJ8wbvEpkSxc62pPtVu2WRfNTBdYLeUpBG1T00tzjdpQGX';

    const findByPkStub = sinon.stub(Database.Product, 'findOne').resolves(null);

    chai
      .request(app)
      .get('/api/successfull-pay')
      .query({ paymentId, user: userId2 })
      .end((err, res) => {
        findByPkStub.restore();
        expect(res.body.message).to.equal('Cart not found');
        done();
      });
  }).timeout(5000);

  it('Payment Cancelled Successfully', function (done) {
    chai
      .request(app)
      .get('/api/cancelled-pay')
      .query({ paymentIntentId: paymentId2 })
      .end((err, res) => {
        expect(res.body.message).to.equal('Payment process Cancelled!!');
        done();
      });
  }).timeout(5000);

  it('should return error 500 when Cancelling payment', function (done) {
    const findAllStub = sinon
      .stub(Database.Product, 'findAll')
      .throws(new Error('Database error'));

    chai
      .request(app)
      .get('/api/cancelled-pay')
      .query({ paymentIntentId: paymentId2 })
      .end((err, res) => {
        findAllStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  }).timeout(5000);
});
