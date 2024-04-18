import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import app from '../src/app';
import { getProductStats } from '../src/controllers/statsController';
import { headerTokenSeller } from './2FA.tets';

chai.use(chaiHttp);
const { expect } = chai;

describe('Product Stats Testing', () => {
  it('should return 401 if not authenticated', async () => {
    const res = await chai.request(app).get('/api/stats?timeFrame=daily');
    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message', 'You are not authorized');
  });

  it('should return 500 if an error occurs', async () => {
    const req: any = {};
    const res: any = {
      status: (statusCode: number) => ({
        send: (data: any) => {
          expect(statusCode).to.equal(500);
          expect(data.message).to.be.a('string');
        },
        json: (data: any) => {
          expect(statusCode).to.equal(500);
          expect(data.message).to.be.a('string');
        },
      }),
    };
    await getProductStats(req, res);
  });

  it('should return product stats for daily', async () => {
    const res = await chai
      .request(app)
      .get('/api/stats?timeFrame=daily')
      .set('Authorization', `Bearer ${headerTokenSeller}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property(
      'message',
      'Statistics are Fetched successfully'
    );
    expect(res.body.data).to.have.property('stats');
  });

  it('should return product stats for last 7 days', async () => {
    const res = await chai
      .request(app)
      .get('/api/stats?timeFrame=last7days')
      .set('Authorization', `Bearer ${headerTokenSeller}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property(
      'message',
      'Statistics are Fetched successfully'
    );
    expect(res.body.data).to.have.property('stats');
  });

  it('should return product stats for last 30 days', async () => {
    const res = await chai
      .request(app)
      .get('/api/stats?timeFrame=last30days')
      .set('Authorization', `Bearer ${headerTokenSeller}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property(
      'message',
      'Statistics are Fetched successfully'
    );
    expect(res.body.data).to.have.property('stats');
  });

  it('should throw an error for an invalid time frame', async () => {
    const req: any = {
      query: {
        timeFrame: 'invalidTimeFrame',
      },
      header: () => {},
    };
    const res: any = {
      status: (statusCode: number) => ({
        send: (data: any) => {
          expect(statusCode).to.equal(500);
          expect(data.message).to.be.a('string');
          expect(data.message).to.equal('Invalid time frame');
        },
        json: (data: any) => {
          expect(statusCode).to.equal(500);
          expect(data.message).to.be.a('string');
          expect(data.message).to.equal('Invalid time frame');
        },
      }),
    };
    await getProductStats(req, res);
  });
});
