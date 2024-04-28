import { expect } from 'chai';
import sinon from 'sinon';
import { passwordExpirationNotification } from '../src/utils/passwordExpirationCheck';
import * as emailSent from '../src/utils/email';

describe('passwordExpirationNotification', () => {
  it('should send email and log info when password needs updating', done => {
    const email = 'ruthuwamahoro250@gmail.com';
    const lastTimePasswordUpdated = new Date(
      Date.now() - 29 * 24 * 60 * 60 * 1000
    );
    const sendEmailStub = sinon.stub(emailSent, 'sendEmail');
    passwordExpirationNotification(lastTimePasswordUpdated, email);
    expect(sendEmailStub.calledOnce).to.be.true;
    sinon.restore();
    done();
  });
});
