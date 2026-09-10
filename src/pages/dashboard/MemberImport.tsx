import { useState } from "react";
import HeaderProps from "../../componeents/dashboard/HeaderPros";
import Button from "../../componeents/ui/Button";
import StatusBadge from "../../componeents/ui/StatusBadge";
import {
  previewMemberImport,
  confirmMemberImport,
  memberImportTemplateUrl,
  type ImportRow,
  type ImportPreview,
  type ImportConfirmResult,
} from "../../../services/apis/memberImport";

type DuplicateChoice = "skip" | "update";

export default function MemberImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview["data"] | null>(null);
  const [choices, setChoices] = useState<Record<number, DuplicateChoice>>({});
  const [result, setResult] = useState<ImportConfirmResult["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!file) {
      setError("Choose a CSV file first.");
      return;
    }
    setLoading(true);
    try {
      const res = await previewMemberImport(file);
      setPreview(res.data);
      // Default every duplicate to "skip".
      const initial: Record<number, DuplicateChoice> = {};
      res.data.duplicate_rows.forEach((r) => {
        if (r.row_number != null) initial[r.row_number] = "skip";
      });
      setChoices(initial);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!preview) return;
    setError("");
    setLoading(true);
    try {
      const validPayload = preview.valid_rows.map((r) => ({
        ...(r.data as Record<string, string>),
        action: "create",
      }));
      const duplicatePayload = preview.duplicate_rows.map((r) => ({
        ...(r.data as Record<string, string>),
        action: r.row_number != null ? choices[r.row_number] ?? "skip" : "skip",
      }));
      const res = await confirmMemberImport([...validPayload, ...duplicatePayload]);
      setResult(res.data);
      setPreview(null);
      setFile(null);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function renderRow(r: ImportRow, tone: "active" | "partial" | "expired", note?: string) {
    const d = r.data || {};
    return (
      <tr key={r.row_number} className="border-b border-[#F1F5F9] last:border-0">
        <td className="px-4 py-3 text-[#0F172A]">{r.row_number}</td>
        <td className="px-4 py-3 text-[#0F172A]">{d.user_name}</td>
        <td className="px-4 py-3 text-[#0F172A]">{d.email}</td>
        <td className="px-4 py-3 text-[#0F172A]">{d.phone_number}</td>
        <td className="px-4 py-3">
          <StatusBadge label={note ?? tone} tone={tone} />
        </td>
      </tr>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <HeaderProps currentPage="Import Members" />
      <div className="p-6 flex-1 space-y-8">
        {error ? (
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="rounded-[28px] border border-[#A7F3D0] bg-[#ECFDF5] p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#166534]">Import complete</h2>
            <p className="mt-2 text-sm text-[#166534]">
              {result.created} created, {result.updated} updated, {result.skipped} skipped.
            </p>
            {result.errors.length > 0 ? (
              <ul className="mt-3 list-disc pl-5 text-sm text-[#991B1B]">
                {result.errors.map((e, i) => (
                  <li key={i}>
                    {e.email}: {e.error}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-4">
              <Button variant="outline" onClick={() => setResult(null)}>
                Import another file
              </Button>
            </div>
          </div>
        ) : null}

        {!preview && !result ? (
          <form
            onSubmit={handlePreview}
            className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-[#0F172A] mb-2">Upload a CSV</h2>
            <p className="text-sm text-[#64748B] mb-4">
              Columns: user_name, email, phone_number, department, tech_stack, date_of_birth.
              <a
                href={memberImportTemplateUrl()}
                className="ml-1 font-semibold text-[#04252D] underline"
              >
                Download template
              </a>
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-[#334155] file:mr-4 file:rounded-lg file:border-0 file:bg-[#FFDD00] file:px-4 file:py-2 file:font-semibold file:text-[#04252D]"
            />
            <div className="mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Reading file..." : "Preview import"}
              </Button>
            </div>
          </form>
        ) : null}

        {preview ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 text-sm">
              <StatusBadge label={`${preview.summary.valid} valid`} tone="active" />
              <StatusBadge label={`${preview.summary.duplicate} duplicate`} tone="partial" />
              <StatusBadge label={`${preview.summary.invalid} invalid`} tone="expired" />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Row</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Email</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">State</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.valid_rows.map((r) => renderRow(r, "active", "valid"))}
                  {preview.invalid_rows.map((r) =>
                    renderRow(r, "expired", (r.errors || []).join(", ") || "invalid")
                  )}
                  {preview.duplicate_rows.map((r) => {
                    const d = r.data || {};
                    return (
                      <tr key={`dup-${r.row_number}`} className="border-b border-[#F1F5F9] last:border-0">
                        <td className="px-4 py-3 text-[#0F172A]">{r.row_number}</td>
                        <td className="px-4 py-3 text-[#0F172A]">{d.user_name}</td>
                        <td className="px-4 py-3 text-[#0F172A]">{d.email}</td>
                        <td className="px-4 py-3 text-[#0F172A]">{d.phone_number}</td>
                        <td className="px-4 py-3">
                          <select
                            value={r.row_number != null ? choices[r.row_number] ?? "skip" : "skip"}
                            onChange={(e) =>
                              r.row_number != null &&
                              setChoices((prev) => ({
                                ...prev,
                                [r.row_number as number]: e.target.value as DuplicateChoice,
                              }))
                            }
                            className="rounded-lg border border-[#CBD5E1] bg-white px-2 py-1 text-sm"
                          >
                            <option value="skip">Skip (duplicate)</option>
                            <option value="update">Update existing</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? "Importing..." : "Confirm import"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
