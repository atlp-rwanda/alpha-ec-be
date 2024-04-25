import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import Database from '../src/database';
import sinon from 'sinon';

chai.use(chaiHttp);
const { expect } = chai;

let productId = '';
let token = '';
let reviewId = '';
let replyId = '';

describe('PRODUCT REVIEW TESTING', () => {
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

  it('Should add a review', async () => {
    const product = await Database.Product.findAll();
    productId = product[0].id;

    const review = {
      productId,
      rating: 5,
      feedback: 'Test review',
    };
    chai
      .request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .end((err, res) => {
        reviewId = res.body.data.id;
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(201);
      });
  });

  it('Should return error if product does not exist', done => {
    const review = {
      productId: 'd290f1ee-6c54-4b01-90e6-d701748f0852',
      rating: 5,
      feedback: 'Test review',
    };
    chai
      .request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should return on server error', done => {
    const findByPkStub = sinon
      .stub(Database.Product, 'findByPk')
      .throws(new Error('Database error'));

    const review = {
      productId,
      rating: 5,
      feedback: 'Test review',
    };
    chai
      .request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .end((err, res) => {
        findByPkStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should get all product reviews', done => {
    chai
      .request(app)
      .get('/api/reviews')
      .query({ productId })
      .end((err, res) => {
        reviewId = res.body.data.allReviews[0].id;
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should add a reply', done => {
    const reply = {
      feedback: 'Test reply',
    };
    console.log('reviewID', reviewId);
    chai
      .request(app)
      .post(`/api/reviews/${reviewId}/replies`)
      .set('Authorization', `Bearer ${token}`)
      .send(reply)
      .end((err, res) => {
        replyId = res.body.data.id;
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(201);
        done();
      });
  });

  it('Should return error if review does not exist', done => {
    const reply = {
      feedback: 'Test reply',
    };
    chai
      .request(app)
      .post('/api/reviews/d290f1ee-6c54-4b01-90e6-d701748f0852/replies')
      .set('Authorization', `Bearer ${token}`)
      .send(reply)
      .end((err, res) => {
        console.log(res.body);
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should return on server error', done => {
    const findStub = sinon
      .stub(Database.Review, 'findOne')
      .throws(new Error('Database error'));

    const reply = {
      feedback: 'Test reply',
    };
    chai
      .request(app)
      .post(`/api/reviews/${reviewId}/replies`)
      .set('Authorization', `Bearer ${token}`)
      .send(reply)
      .end((err, res) => {
        findStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should return 500 on server error while getting all product reviews', done => {
    const getallStub = sinon
      .stub(Database.Product, 'findByPk')
      .throws(new Error('Database error'));

    chai
      .request(app)
      .get('/api/reviews')
      .query({ productId })
      .end((err, res) => {
        getallStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it("Should return error if product doesn't exist", done => {
    chai
      .request(app)
      .get('/api/reviews')
      .query({ productId: 'd290f1ee-6c54-4b01-90e6-d701748f0852' })
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should get all replies on a reviews', done => {
    chai
      .request(app)
      .get(`/api/reviews/${reviewId}/replies`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Should return 500 on server error while getting all replies', done => {
    const getallStub = sinon
      .stub(Database.Review, 'findByPk')
      .throws(new Error('Database error'));

    chai
      .request(app)
      .get(`/api/reviews/${reviewId}/replies`)
      .query({ productId })
      .end((err, res) => {
        getallStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should get all replies on a reviews', done => {
    chai
      .request(app)
      .get(`/api/reviews/d290f1ee-6c54-4b01-90e6-d701748f0852/replies`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it("Should return error if product doesn't exist", done => {
    chai
      .request(app)
      .delete('/api/reviews/d290f1ee-6c54-4b01-90e6-d701748f0852')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should return server error while deleting a review', done => {
    const destroyStub = sinon
      .stub(Database.Review, 'findOne')
      .throws(new Error('Database error'));

    chai
      .request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        destroyStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it('Should return server error while deleting a review', done => {
    const destroyStub = sinon
      .stub(Database.Reply, 'destroy')
      .throws(new Error('Database error'));

    chai
      .request(app)
      .delete(`/api/reviews/${reviewId}/replies/${replyId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        destroyStub.restore();
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(500);
        done();
      });
  });

  it("Should return error if product doesn't exist", done => {
    chai
      .request(app)
      .delete(
        '/api/reviews/d290f1ee-6c54-4b01-90e6-d701748f0852/replies/d290f1ee-6c54-4b01-90e6-d701748f0852'
      )
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(404);
        done();
      });
  });

  it('Should delete a reply', done => {
    chai
      .request(app)
      .delete(`/api/reviews/${reviewId}/replies/${replyId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
      });
    done();
  });

  it('Should delete a review', done => {
    chai
      .request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.body).to.have.property('message');
        expect(res).to.have.status(200);
        done();
      });
  });
});
