const base_Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/";
const api_key = import.meta.env.VITE_API_KEY;

// ---- Community member CSV bulk import (Super Admin only) ----

export type ImportRow = {
  row_number?: number;
  data?: Record<string, string>;
  errors?: string[];
  reason?: string;
};

export type ImportPreview = {
  status: boolean;
  msg: string;
  data: {
    valid_rows: ImportRow[];
    duplicate_rows: ImportRow[];
    invalid_rows: ImportRow[];
    summary: { valid: number; duplicate: number; invalid: number };
  };
};

export type ImportConfirmResult = {
  status: boolean;
  msg: string;
  data: {
    created: number;
    updated: number;
    skipped: number;
    errors: { email: string; error: string }[];
  };
};

// Preview uses multipart/form-data, so it bypasses the JSON apifetch wrapper.
export async function previewMemberImport(file: File): Promise<ImportPreview> {
  const token = localStorage.getItem("access_token");
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${base_Url}api/v1/member/import/preview/`, {
    method: "POST",
    headers: {
      "x-api-key": `${api_key}`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.msg || "Failed to preview import");
  }
  return res.json();
}

export async function confirmMemberImport(
  rows: Array<Record<string, string>>
): Promise<ImportConfirmResult> {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${base_Url}api/v1/member/import/confirm/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `${api_key}`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.msg || "Failed to confirm import");
  }
  return res.json();
}

export function memberImportTemplateUrl(): string {
  return `${base_Url}api/v1/member/import/template/`;
}
