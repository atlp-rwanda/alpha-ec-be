import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import Database from '../src/database';
import sinon from 'sinon';
import { headerTokenSeller } from './2FA.tets';

chai.use(chaiHttp);
const { expect } = chai;
let token: string = '';
let id: string = '';
describe('ORDER MANAGMENT TEST', () => {
  it('get product-order with 500 ', done => {
    const { ProductOrder } = Database;

    sinon
      .stub(ProductOrder, 'findAll')
      .throws(new Error('Internal server error'));
    chai
      .request(app)
      .get('/api/product-orders')
      .set('Authorization', `Bearer ${headerTokenSeller}`)
      .end((err, res) => {
        (ProductOrder.findAll as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });
  it('should get with 200', done => {
    chai
      .request(app)
      .get(`/api/product-orders`)
      .set('Authorization', `Bearer ${headerTokenSeller}`)
      .end((err, res) => {
        id = res.body.data[0].id;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should update with error 500', async () => {
    const status = {
      status: 'accepted',
    };
    chai
      .request(app)
      .put(`/api/product-orders/:orderId/status`)
      .set('Authorization', `Bearer ${headerTokenSeller}`)
      .send(status)
      .end((err, res) => {
        expect(res).to.have.status(500);
      });
  });
  it('should update with 200', done => {
    const status = {
      status: 'accepted',
    };
    chai
      .request(app)
      .put(`/api/product-orders/${id}/status`)
      .set('Authorization', `Bearer ${headerTokenSeller}`)
      .send(status)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('error in update a product-order ', done => {
    const fakeID = '';
    const status = {
      status: 'accepted',
    };
    chai
      .request(app)
      .put(`/api/product-orders/${fakeID}/status`)
      .set('Authorization', `Bearer ${headerTokenSeller}`)
      .send(status)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('Should return product order not found', function () {
    const status = {
      status: 'accepted',
    };
    const findByPkStub = sinon
      .stub(Database.ProductOrder, 'findByPk')
      .resolves(null);

    chai
      .request(app)
      .put(`/api/product-orders/${id}/status`)
      .set('Authorization', ` Bearer ${headerTokenSeller}`)
      .send(status)
      .end((err, res) => {
        findByPkStub.restore();
        expect(res.body.message).to.equal('Product order not found');
      });
  });
});
