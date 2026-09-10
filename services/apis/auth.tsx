import apifetch from "./api";

// ---- Member phone/email login flow ----

export type MemberUser = {
  name: string;
  role: string;
  email: string;
  phone_number: string;
  id: string;
};

type MemberLoginResponse = {
  status: boolean;
  msg: string;
  data: {
    user: MemberUser;
    tokens: { refresh_token: string; access_token: string };
  };
};

type HasPasswordResponse = {
  status: boolean;
  msg: string;
  data: { has_password: boolean };
};

type GenericResponse = {
  status: boolean;
  msg: string;
  not_a_member?: boolean;
};

export function checkMemberHasPassword(payload: { identifier: string }) {
  return apifetch<HasPasswordResponse>(
    "api/v1/member/check-if-member-has-password/",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );
}

export function setMemberPassword(payload: { identifier: string; password: string }) {
  return apifetch<GenericResponse>(
    "api/v1/member/set-password/",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );
}

export function memberLogin(payload: { identifier: string; password: string }) {
  return apifetch<MemberLoginResponse>(
    "api/v1/member/login/",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );
}

// ---- Current user (role detection for the dashboard) ----

export type MeResponse = {
  status: boolean;
  msg: string;
  data: {
    id: string;
    user_name: string;
    email: string;
    phone_number: string | null;
    role: string | null;
    admin_role: "super" | "staff" | null;
  };
};

export function getMe() {
  return apifetch<MeResponse>("api/v1/auth/me/", { method: "GET" });
}
