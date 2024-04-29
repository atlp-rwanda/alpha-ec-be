import chai from 'chai';
import sinon from 'sinon';
import Database from '../src/database';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import { token } from './product.test';

chai.use(chaiHttp);
const { expect } = chai;

const categoryId = '2d854884-ea82-468f-9883-c86ce8d5a003';
const invalidId = '2d854884-ea82-468f-9883-c86ce8d50000';
describe('CATEGORIES API TEST', () => {
  it('Should create a category', function (done) {
    this.timeout(5000);
    const body = {
      name: 'Test Category',
      description: 'Test category',
    };
    chai
      .request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        expect(res.body.message).to.equal('Category created successfully!');
        done();
      });
  });

  it('Should not create a category twice', function (done) {
    const body = {
      name: 'Test Category',
    };
    chai
      .request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        expect(res.body.message).to.equal(
          'Category with this name already exists.'
        );
        done();
      });
  });

  it('Should handle server errors during category creation', function (done) {
    const findOneStub = sinon
      .stub(Database.Category, 'build')
      .throws(new Error('Database error'));

    const body = {
      name: 'Test Category',
    };
    chai
      .request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        findOneStub.restore();
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should get all categories', function (done) {
    chai
      .request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should throw an error while getting all categories', function (done) {
    const findAllStub = sinon
      .stub(Database.Category, 'findAll')
      .throws(new Error('Database error'));
    chai
      .request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        findAllStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should throw an error while deleting a category', function (done) {
    const deleteStub = sinon
      .stub(Database.Category, 'findByPk')
      .throws(new Error('Database error'));
    chai
      .request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        deleteStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should return error if category is not found', function (done) {
    chai
      .request(app)
      .delete(`/api/categories/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should update a category', function (done) {
    const body = {
      name: 'Test',
    };
    chai
      .request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should not update a category with used name', function (done) {
    const body = {
      name: 'Test',
    };
    chai
      .request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(400);
        done();
      });
  });

  it('Should not update unfound category', function (done) {
    const body = {
      name: 'Test 1234',
    };
    chai
      .request(app)
      .put(`/api/categories/${invalidId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(400);

        done();
      });
  });

  it('Should handle server error while updating', function (done) {
    const updateStub = sinon
      .stub(Database.Category, 'update')
      .throws(new Error('Database error'));
    const body = {
      name: 'Test 1234',
    };
    chai
      .request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .end((err, res) => {
        updateStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);

        done();
      });
  });

  it('Should delete a category', function (done) {
    chai
      .request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });
});
