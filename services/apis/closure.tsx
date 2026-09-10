import apifetch from "./api";

// ---- Hub closure dates (Super Admin creates/deletes, any admin lists) ----

export type ClosureDate = {
  id: string;
  date: string;
  reason: string;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
};

type ClosureListResponse = {
  status: boolean;
  msg: string;
  data: ClosureDate[];
};

type ClosureResponse = {
  status: boolean;
  msg: string;
  data: ClosureDate;
};

export function listClosureDates() {
  return apifetch<ClosureListResponse>("api/v1/hub-closure/dates/", { method: "GET" });
}

export function createClosureDate(payload: { date: string; reason: string }) {
  return apifetch<ClosureResponse>("api/v1/hub-closure/dates/create/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteClosureDate(id: string) {
  return apifetch(`api/v1/hub-closure/dates/${id}/`, { method: "DELETE" });
}
