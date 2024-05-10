import chai, { request } from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import Database from '../src/database';
import sinon from 'sinon';

chai.use(chaiHttp);
const { expect } = chai;
let token: string = '';
let id: string = '';
describe('CART TEST', () => {
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
        token = res.body.data;
        done();
      });
  });

  it('should handle server errors during post of cart', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;
    const carts = sinon
      .stub(Database.Cart.prototype, 'save')
      .throws(new Error('Validation error'));

    const user = {
      productId,
      quantity: '1',
    };

    chai
      .request(app)
      .post('/api/carts')
      .set('Authorization', `Bearer ${token}`)
      .send(user)
      .end((err, res) => {
        carts.restore();
        expect(res.statusCode).to.equal(500);
        expect(res.body).to.have.property('message');
      });
  });

  it('should post with 201', async () => {
    const product = await Database.Product.findAll();
    let productId = product[0].id;
    console.log(productId);
    const products = {
      productId,
      quantity: '1',
    };
    chai
      .request(app)
      .post(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(201);
      });
  });
  it('should post with 201', async () => {
    const product = await Database.Product.findAll();
    let productId = product[1].id;
    console.log(productId);
    const products = {
      productId,
      quantity: '1',
    };
    chai
      .request(app)
      .post(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(201);
      });
  });

  it('should post when exists 409', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;
    console.log(productId);
    const products = {
      productId,
      quantity: '1',
    };
    chai
      .request(app)
      .post(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(409);
      });
  });
  it('should post with error of excess quantity 406', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;
    const products = {
      productId,
      quantity: '100',
    };
    chai
      .request(app)
      .post(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(406);
      });
  });

  it('should post with error of 404', done => {
    const productId = '20adb047-8102-494d-8a8a-7b50990bc770';
    const products = {
      productId,
      quantity: '1',
    };
    chai
      .request(app)
      .post(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('get cart with error of 500 ', done => {
    const { Cart } = Database;

    sinon.stub(Cart, 'findAll').throws(new Error('Internal server error'));
    chai
      .request(app)
      .get('/api/carts')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        (Cart.findAll as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });

  it('should get with 200', done => {
    chai
      .request(app)
      .get(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        id = res.body.data.id;
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should update with 500', async () => {
    const product = await Database.Product.findAll();
    let productId = product[0].id;
    console.log(productId);
    const id = 'hello world';
    const products = {
      productId,
      quantity: '5',
    };
    chai
      .request(app)
      .patch('/api/carts/' + id)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(500);
      });
  });
  it('should update with 201', async () => {
    const product = await Database.Product.findAll();
    let productId = product[0].id;
    console.log(productId);
    const products = {
      productId,
      quantity: '5',
    };
    chai
      .request(app)
      .patch('/api/carts/' + id)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(201);
      });
  });

  it('delete cart with 500', done => {
    const { Cart } = Database;
    sinon.stub(Cart, 'destroy').throws(new Error('Internal server error'));
    chai
      .request(app)
      .delete('/api/carts/' + id)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        (Cart.destroy as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });
  it('delete product from cart with 500', done => {
    const { Cart } = Database;
    sinon.stub(Cart, 'destroy').throws(new Error('Internal server error'));
    const id = 'hello';
    chai
      .request(app)
      .delete('/api/carts/' + id)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        (Cart.destroy as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });
  it('delete product in  cart with 500', done => {
    const { Cart } = Database;
    sinon.stub(Cart, 'destroy').throws(new Error('Internal server error'));
    chai
      .request(app)
      .delete('/api/carts/products' + id)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        (Cart.destroy as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });

  it('Should delete a product in  cart ', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;
    const products = {
      productId,
      quantity: '1',
    };
    chai
      .request(app)
      .delete(`/api/carts/products/` + productId)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(200);
      });
  });

  it('Should empty the cart ', function (done) {
    chai
      .request(app)
      .put(`/api/carts/` + id)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('delete cart with 200', done => {
    chai
      .request(app)
      .delete(`/api/carts/` + id)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('delete cart at 404', done => {
    const id = '30608204-28fe-4220-b090-1112ebd3c6a3';
    chai
      .request(app)
      .delete(`/api/carts/` + id)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('cart not found', done => {
    chai
      .request(app)
      .get(`/api/carts`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('error in patch a product in  cart ', function (done) {
    const product = {
      productId: 'f52d7e2f-aacc-4dc5-949c-66349c312b59',
      quantity: '2',
    };
    chai
      .request(app)
      .patch(`/api/carts/:cartId`)
      .set('Authorization', `Bearer ${token}`)
      .send(product)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it(' patch a product in  cart ', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;
    const products = {
      productId,
      quantity: '5',
    };
    chai
      .request(app)
      .patch(`/api/carts/` + id)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(404);
      });
  });
  it('should update the cart', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;
    const products = {
      productId,
      quantity: '100',
    };
    chai
      .request(app)
      .patch(`/api/carts/:cartId`)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(406);
      });
  });

  it('Should error in empty the cart  ', function (done) {
    chai
      .request(app)
      .put(`/api/carts` + id)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('error when cart not found', async () => {
    const product = await Database.Product.findAll();
    const productId = product[0].id;
    const products = {
      productId,
      quantity: '5',
    };
    chai
      .request(app)
      .patch(`/api/carts` + id)
      .set('Authorization', `Bearer ${token}`)
      .send(products)
      .end((err, res) => {
        expect(res).to.have.status(404);
      });
  });
  it('error when cart not found', async () => {
    const prodid = '30608204-28fe-4220-b090-1112ebd3c6a3';
    chai
      .request(app)
      .put(`/api/carts/` + prodid)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
      });
  });
  it('delete cart with 404', done => {
    const productId = '20adb047-8102-494d-8a8a-7b50990bc770';
    chai
      .request(app)
      .delete(`/api/carts/products/` + productId)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('get empty cart with 500 ', done => {
    const { Cart } = Database;
    sinon.stub(Cart, 'findOne').throws(new Error('Internal server error'));
    chai
      .request(app)
      .put('/api/carts/' + id)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        (Cart.findOne as sinon.SinonStub).restore();
        expect(res.statusCode).to.equal(500);
        done();
      });
  });
});
