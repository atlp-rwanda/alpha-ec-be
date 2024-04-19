import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon'; // Import SinonSandbox type
import { notifyProductExpiry } from '../src/utils/productExpiryNotifier';
import { User } from '../src/database/models/user';
import { sendEmail } from '../src/utils/email';

describe('notifyProductExpiry', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should send email notification for expired product', async () => {
    const product = {
      name: 'Test Product',
      sellerId: 1,
      expiryDate: new Date(),
    };

    const seller = {
      id: 1,
      name: 'Test Seller',
      email: 'test@example.com',
    };

    sandbox.stub(User, 'findOne').resolves(seller as any);

    await notifyProductExpiry(product as any);

    const sendEmailStub = sinon.stub().resolves();

    expect(sendEmailStub.calledOnce).to.be.true;
    expect(
      sendEmailStub.calledWith({
        to: seller.email,
        subject: 'Product Expiry Notification',
        body: `Your product ${product.name} has expired.`,
      })
    ).to.be.true;
  }).timeout(10000);

  it('should log error if seller is not found', async () => {
    const product = {
      name: 'Test Product',
      sellerId: 1,
      expiryDate: new Date(),
    };

    sandbox.stub(User, 'findOne').resolves(null);
    const consoleErrorStub = sandbox.stub(console, 'error');

    await notifyProductExpiry(product as any);

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(
      consoleErrorStub.calledWith(
        `Seller not found for product ${product.name}`
      )
    ).to.be.true;
  });

  it('should log error if sending email fails', async () => {
    const product = {
      name: 'Test Product',
      sellerId: 1,
      expiryDate: new Date(),
    };

    const seller = {
      id: 1,
      name: 'Test Seller',
      email: 'test@example.com',
    };

    sandbox.stub(User, 'findOne').resolves(seller as any);
    //   sandbox.stub(sendEmail).throws('Error sending email');

    const consoleErrorStub = sandbox.stub(console, 'error');

    await notifyProductExpiry(product as any);

    expect(consoleErrorStub.calledOnce).to.be.true;
    expect(
      consoleErrorStub.calledWith(
        `Failed to send email for product ${product.name}:`,
        sinon.match.instanceOf(Error)
      )
    ).to.be.true;
  }).timeout(10000);
});
