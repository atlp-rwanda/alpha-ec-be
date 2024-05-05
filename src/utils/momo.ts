import axios, { AxiosResponse } from 'axios';

enum PaymentStatus {
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export interface Transaction {
  txRef: string;
  amount: string;
  account: string;
}

export class Momo {
  private mtnSubscriptionKey: string;

  private targetEnvironment: string;

  constructor(mtnSubscriptionKey: string, targetEnvironment: string) {
    this.mtnSubscriptionKey = mtnSubscriptionKey;
    this.targetEnvironment = targetEnvironment;
  }

  private async getToken(): Promise<string> {
    // TODO
    return 'token';
  }

  private async paymentStatus(txRef: string): Promise<PaymentStatus> {
    try {
      const response = await axios.get(
        `https://proxy.momoapi.mtn.co.rw/collection/v1_0/requesttopay/${txRef}`,
        {
          headers: {
            Authorization: `Bearer ${await this.getToken()}`,
            'Ocp-Apim-Subscription-Key': this.mtnSubscriptionKey,
            'X-Reference-Id': txRef,
            'X-Target-Environment': this.targetEnvironment,
          },
        }
      );
      return response.data.status as PaymentStatus;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return PaymentStatus.FAILED;
    }
  }

  async pay(transaction: Transaction): Promise<PaymentStatus> {
    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://proxy.momoapi.mtn.co.rw/collection/v1_0/requesttopay',
        {
          amount: transaction.amount,
          currency: 'RWF',
          externalId: transaction.txRef,
          payer: {
            partyIdType: 'MSISDN',
            partyId: transaction.account,
          },
          payerMessage: '',
          payeeNote: '',
        },
        {
          headers: {
            Authorization: `Bearer ${await this.getToken()}`,
            'Ocp-Apim-Subscription-Key': this.mtnSubscriptionKey,
            'X-Reference-Id': transaction.txRef,
            'X-Target-Environment': this.targetEnvironment,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 202) {
        const status: PaymentStatus = await this.paymentStatus(
          transaction.txRef
        );
        return status;
      }
      return PaymentStatus.FAILED;
    } catch (error) {
      console.error('Error initiating payment:', error);
      return PaymentStatus.FAILED;
    }
  }
}
