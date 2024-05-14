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
    const res = await chai.request(app).get('/api/stats?startDate=2024-05-14&endDate=2024-05-15');
    expect(res).to.have.status(401);
    expect(res.body).to.have.property('message', 'You are not authorized');
  });

  it('should return 500 if an error occurs', async () => {
    const req: any = {
      query: { startDate: '2024-05-14', endDate: '2024-05-15' }, 
    };
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

  it('should return product stats depending on startDate and endDate', async () => {
    const res = await chai
      .request(app)
      .get('/api/stats?startDate=2024-05-14&endDate=2024-05-15')
      .set('Authorization', `Bearer ${headerTokenSeller}`);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property(
      'message',
      'Statistics are fetched successfully'
    );
    expect(res.body.data).to.have.property('stats');
  });
});
