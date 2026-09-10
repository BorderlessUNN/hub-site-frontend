import apifetch from "./api";

// ---- Admin account management (Super Admin only) ----

export type AdminAccount = {
  id: string;
  user_name: string;
  email: string;
  admin_role: "super" | "staff";
  is_active: boolean;
  last_login: string | null;
};

type AdminListResponse = {
  status: boolean;
  msg: string;
  data: AdminAccount[];
};

type AdminResponse = {
  status: boolean;
  msg: string;
  data: AdminAccount;
};

export function listAdmins() {
  return apifetch<AdminListResponse>("api/v1/admin/list/", { method: "GET" });
}

export function createAdmin(payload: {
  user_name: string;
  email: string;
  password: string;
  admin_role: "super" | "staff";
}) {
  return apifetch<AdminResponse>("api/v1/admin/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deactivateAdmin(payload: { admin_id: string }) {
  return apifetch<AdminResponse>("api/v1/admin/deactivate/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---- Fast phone-number account search (any admin tier) ----

export type SearchedUser = {
  id: string;
  user_name: string;
  email: string;
  department: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  tech_stack: string | null;
  role: string;
};

type SearchResponse = {
  status: boolean;
  msg: string;
  data: SearchedUser;
};

export function searchByPhone(phone_number: string) {
  return apifetch<SearchResponse>(
    `api/v1/accounts/search/?phone_number=${encodeURIComponent(phone_number)}`,
    { method: "GET" }
  );
}

// ---- Community member directory (any admin tier) ----

type MemberListResponse = {
  status: boolean;
  msg: string;
  data: SearchedUser[];
};

export function listMembers(search?: string) {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return apifetch<MemberListResponse>(`api/v1/member/list/${q}`, {
    method: "GET",
  });
}
