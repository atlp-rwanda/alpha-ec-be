import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import sinon from 'sinon';
import Database from '../src/database';

chai.use(chaiHttp);
const { expect } = chai;

let token = '';

let id = '';
let id2 = '';

describe('should create and assign role', () => {
  describe('should test roles', () => {
    before(done => {
      const user = {
        email: 'test2@example.com',
        password: '1111@aa',
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
    it(' it should get all users with a stutus code of 200', done => {
      chai
        .request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
    it('it should return status code of 201', done => {
      const role = {
        name: 'guest',
        description: 'guest role',
      };
      chai
        .request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${token}`)
        .send(role)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role created successfully!');
          done();
        });
    });
    it('should return status code of 400 if role exit', done => {
      const role = {
        name: 'guest',
      };
      chai
        .request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${token}`)
        .send(role)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal(
            'A role with this name already exists.'
          );
          done();
        });
    });
    it('get all wishes with status code of 200 ', done => {
      chai
        .request(app)
        .get('/api/wishes')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(403);
          done();
        });
    });
    it('Should not delete a product should be 401 if you are not seller', function (done) {
      chai
        .request(app)
        .delete(`/api/products/3669aace-d388-49dc-bd1a-8ec2885baa22`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body).to.have.property('message');
          expect(res).to.have.status(403);
          expect(res.body.message).to.equal('Not authorized!');
          done();
        });
    });
    it('should handle server errors during role creation', function (done) {
      const role = sinon
        .stub(Database.Role.prototype, 'save')
        .throws(new Error('Validation error'));

      const user = {
        names: 'guest',
        desc: 'guest role',
      };

      chai
        .request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .end((err, res) => {
          role.restore();

          expect(res.statusCode).to.equal(500);
          expect(res.body).to.have.property('message');
          done();
        });
    });
    it('get all roles with status code of 200 ', done => {
      chai
        .request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          id = res.body.data[0].id;
          id2 = res.body.data[3].id;
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Roles fetched successfully!');
          done();
        });
    });
    it('get all role with 500 ', done => {
      const { Role } = Database;

      sinon.stub(Role, 'findAll').throws(new Error('Internal server error'));
      chai
        .request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          (Role.findAll as sinon.SinonStub).restore();
          expect(res.statusCode).to.equal(500);
          done();
        });
    });

    it('get role with status code of 200 ', done => {
      chai
        .request(app)
        .get('/api/roles/' + id)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role fetched successfully!');
          done();
        });
    });

    it('get  role with status code of 404 ', done => {
      chai
        .request(app)
        .get('/api/roles/' + '15a2c4b7-ae5f-4a22-b7a9-7aababdb0c34')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });
    it('delete role with status code of 204 ', done => {
      chai
        .request(app)
        .delete('/api/roles/' + id2)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(204);
          done();
        });
    });

    it('should assign role return status code of 200', async () => {
      const roles = await Database.Role.findAll();
      const roleId = roles[0].id;
      const users = await Database.User.findAll();
      const userId = users[0].id;

      const role = {
        userId,
        roleId,
      };

      return chai
        .request(app)
        .post('/api/users/roles')
        .set('Authorization', `Bearer ${token}`)
        .send(role)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role assigned successfully!');
        });
    });
    it('should assign role return status code of 404 when user not found', async () => {
      const roles = await Database.Role.findAll();
      const roleId = roles[0].id;

      const userId = 'd290f1ee-6c54-4b01-90e6-d701748f0863';

      const role = {
        userId,
        roleId,
      };

      return chai
        .request(app)
        .post('/api/users/roles')
        .set('Authorization', `Bearer ${token}`)
        .send(role)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
        });
    });
    it('should assign role return status code of 404 when role not found', async () => {
      const roleId = '3c34c7cc-443c-4f9a-abcf-2749bfc18f4c';
      const users = await Database.User.findAll();
      const userId = users[0].id;

      const role = {
        userId,
        roleId,
      };

      return chai
        .request(app)
        .post('/api/users/roles')
        .set('Authorization', `Bearer ${token}`)
        .send(role)
        .then(res => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role not found');
        });
    });
    it('should assign role return status code of 500', async () => {
      const roleId = 'guest';

      const role = {
        userId: 'guest',
        roleId,
      };

      return chai
        .request(app)
        .post('/api/users/roles')
        .set('Authorization', `Bearer ${token}`)
        .send(role)
        .then(res => {
          expect(res).to.have.status(500);
        });
    });
    it('delete role returns 404 if role is not found', done => {
      const { Role } = Database;

      sinon.stub(Role, 'findByPk').resolves(null);

      chai
        .request(app)
        .delete('/api/roles/' + 'ae5f-4a22-b7a9-7aababdb0c34')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          (Role.findByPk as sinon.SinonStub).restore();
          expect(res.statusCode).to.equal(404);
          expect(res.body.message).to.equal('Role not found');
          done();
        });
    });
    it('delete role with status code of 500 ', done => {
      chai
        .request(app)
        .delete('/api/roles/' + '1233')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(500);
          done();
        });
    });

    it('get  invalid role with status code of 500', done => {
      chai
        .request(app)
        .get('/api/roles/' + '15234')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(500);
          done();
        });
    });
  });
});
