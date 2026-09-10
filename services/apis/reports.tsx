import apifetch from "./api";

// ---- Reporting (Super Admin: payments & users-by-status; any admin: daily) ----

type PaymentsReport = {
  status: boolean;
  msg: string;
  data: {
    month: string;
    full_payments: { count: number; total: number };
    installment_payments: { count: number; total: number };
    first_installments: { count: number; total: number };
    second_installments: { count: number; total: number };
    completed_installment_pairs: number;
    grand_total: number;
  };
};

export function paymentsReport(month?: string) {
  const q = month ? `?month=${encodeURIComponent(month)}` : "";
  return apifetch<PaymentsReport>(`api/v1/dashboard/reports/payments/${q}`, {
    method: "GET",
  });
}

export type StatusUser = {
  user_id: string;
  name: string;
  email: string;
  phone_number: string | null;
  subscription_id: string;
  status: string;
  expires_at: string | null;
  partial_expires_at: string | null;
  days_to_cutoff?: number | null;
  is_nearing_cutoff?: boolean;
  remaining_seconds?: number | null;
};

type UsersByStatusReport = {
  status: boolean;
  msg: string;
  data: {
    active_members: StatusUser[];
    partial_members: StatusUser[];
    expired_members: StatusUser[];
    non_members_with_time: StatusUser[];
  };
};

export function usersByStatusReport() {
  return apifetch<UsersByStatusReport>("api/v1/dashboard/reports/users-by-status/", {
    method: "GET",
  });
}

export type DailyCheckinRow = {
  checkin_id: string;
  user_id: string;
  name: string;
  email: string;
  phone_number: string | null;
  start_time: string;
  status: string;
  partial_expires_at?: string | null;
  is_nearing_cutoff?: boolean;
  expiry_date_time?: string | null;
  end_time?: string | null;
  remaining_seconds?: number | null;
  is_expired?: boolean;
  is_nearing_expiry?: boolean;
};

type DailyCheckinsReport = {
  status: boolean;
  msg: string;
  data: {
    date: string;
    active_members: DailyCheckinRow[];
    partial_members: DailyCheckinRow[];
    expired_users: DailyCheckinRow[];
    non_members: DailyCheckinRow[];
  };
};

export function dailyCheckinsReport(date?: string) {
  const q = date ? `?date=${encodeURIComponent(date)}` : "";
  return apifetch<DailyCheckinsReport>(`api/v1/dashboard/reports/daily-checkins/${q}`, {
    method: "GET",
  });
}
