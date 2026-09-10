import apifetch from "./api";

// ---- Payments / plans ----

export type Plan = {
  id: string;
  name: string;
  price: number;
  hours: number | null;
  slug: string;
  is_member_only: boolean;
  is_paid_in_installment: boolean | null;
  installment_price: number | null;
};

type PlansResponse = {
  status: boolean;
  msg: string;
  data: Plan[];
};

// NOTE: plans live at /plans/plans/ on the backend (not /payments/plans/).
export function getPlans(options?: { signal?: AbortSignal }) {
  return apifetch<PlansResponse>("api/v1/plans/plans/", {
    method: "GET",
    ...(options || {}),
  });
}

// ---- Payment history for a user (self-service dashboard) ----

export type PaymentRecord = {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  payment_type: string;
  payment_status: string;
  paystack_reference: string;
  installment_number: string | null;
  created_at: string;
  updated_at: string;
};

type PaymentsResponse = {
  status: boolean;
  msg: string;
  data: PaymentRecord[];
};

export function listPayments() {
  return apifetch<PaymentsResponse>("api/v1/payments/payment/", { method: "GET" });
}
