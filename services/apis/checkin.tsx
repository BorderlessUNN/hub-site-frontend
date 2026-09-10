import apifetch from "./api";

// ---- Attendance check-in (records a CheckIn against an active subscription) ----

export function createCheckIn(payload: { user_id: string }) {
  return apifetch("api/v1/check-in/check-in/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---- Non-member session check-out / extend (admin only) ----

type CheckInResponse = {
  status: boolean;
  msg: string;
  data: {
    id: string;
    subscription: string;
    start_time: string;
    end_time: string | null;
    expiry_date_time: string | null;
    is_expired: boolean;
    is_nearing_expiry: boolean;
  };
};

export function nonMemberCheckout(payload: { checkin_id: string }) {
  return apifetch<CheckInResponse>("api/v1/check-in/non_member/check-out/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function extendNonMemberSession(payload: {
  checkin_id: string;
  additional_hours: number;
}) {
  return apifetch<CheckInResponse>("api/v1/check-in/non_member/extend/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
