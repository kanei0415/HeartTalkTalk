export type IMPPaymentData = {
  pg: 'kakaopay' | 'nice_v2';
  pay_method: 'card';
  merchant_uid: string;
  amount: number;
  name: string;
  buyer_name: string;
  buyer_email: string;
};

export type IMPPaymentResponse = {
  success: boolean;
  merchant_uid: string;
  error_msg: string;
};
