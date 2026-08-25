export interface EnrollmentRequest {
  planId: string;
  voucherCode?: string;
}

export interface EnrollmentResponse {
  subscriptionId: string;
  planId: string;
  amount: number;
  currency: string;
  status: string;
  startDate: string;
  endDate: string;
  voucherApplied: boolean;
}