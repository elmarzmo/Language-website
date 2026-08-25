export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingInterval: string;
  active: boolean;
}