import apifetch from "./api";

export type Subscription = {
  id: string;
  user: string;
  plan: string;
  admin_assigned: boolean;
  status: string;
  expires_at: string | null;
  partial_expires_at: string | null;
  hours: number | null;
  created_at: string;
  updated_at: string;
};

type SubscriptionListResponse = {
  status: boolean;
  msg: string;
  data: Subscription[];
};

type PaymentInitResponse = {
  status: boolean;
  msg: string;
  data: {
    authorization_url: string;
    reference: string;
    subscription: Subscription;
  };
};

type SubscriptionResponse = {
  status: boolean;
  msg: string;
  data: Subscription;
};

// Member: start a full/first-installment subscription, or complete the
// second installment. Returns a Paystack authorization_url to redirect to.
export function createMemberSubscription(payload: {
  user_id: string;
  plan_id: string;
  installment_number?: "1" | "2" | null;
  is_admin_assigned?: boolean;
}) {
  return apifetch<PaymentInitResponse | SubscriptionResponse>(
    "api/v1/subscription/member-subscription/",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

// Non-member walk-in booking (creates the user + subscription). Returns a
// Paystack authorization_url unless admin-assigned.
export function createNonMemberSubscription(payload: {
  name: string;
  email: string;
  phone_number: string;
  plan_id: string;
  hours: number;
  is_admin_assigned?: boolean;
}) {
  return apifetch<PaymentInitResponse | SubscriptionResponse>(
    "api/v1/subscription/non-member-subscription/",
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export function listSubscriptions() {
  return apifetch<SubscriptionListResponse>("api/v1/subscription/subscription/", {
    method: "GET",
  });
}

export function verifyPayment(reference: string) {
  return apifetch(
    "api/v1/payments/verify/",
    { method: "POST", body: JSON.stringify({ reference }) },
    false
  );
}

// Admin records a cash/offline payment on a user's behalf.
export function recordOfflinePayment(payload: {
  user_id: string;
  plan_id: string;
  installment_number?: "1" | "2" | null;
  hours?: number;
}) {
  return apifetch<SubscriptionResponse>("api/v1/payments/record-offline/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
