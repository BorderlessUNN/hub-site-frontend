import { useEffect, useState } from "react";
import HeaderProps from "../../componeents/dashboard/HeaderPros";
import Button from "../../componeents/ui/Button";
import FormField from "../../componeents/ui/FormField";
import DataTable, { type Column } from "../../componeents/ui/DataTable";
import {
  listClosureDates,
  createClosureDate,
  deleteClosureDate,
  type ClosureDate,
} from "../../../services/apis/closure";

export default function ClosureDates() {
  const [dates, setDates] = useState<ClosureDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await listClosureDates();
      setDates(res.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!date || !reason) {
      setError("Enter a date and a reason.");
      return;
    }
    setSubmitting(true);
    try {
      await createClosureDate({ date, reason });
      setMessage(`Marked ${date} as closed. Affected subscriptions were extended.`);
      setDate("");
      setReason("");
      refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    setMessage("");
    try {
      await deleteClosureDate(id);
      refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  const columns: Column<ClosureDate>[] = [
    { header: "Date", cell: (c) => new Date(c.date).toLocaleDateString() },
    { header: "Reason", cell: (c) => c.reason },
    {
      header: "Actions",
      cell: (c) => (
        <button
          onClick={() => handleDelete(c.id)}
          className="text-sm font-semibold text-red-600 hover:underline"
        >
          Remove
        </button>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <HeaderProps currentPage="Closure Days" />
      <div className="p-6 flex-1 space-y-8">
        {error ? (
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-sm text-[#166534]">
            {message}
          </div>
        ) : null}

        <form
          onSubmit={handleCreate}
          className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[#0F172A] mb-2">Mark a day as closed</h2>
          <p className="text-sm text-[#64748B] mb-4">
            Closure days don't count toward the 7-day or 30-day windows. May be added up to a month in the past.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Date" type="date" value={date} onChange={setDate} required />
            <FormField label="Reason" value={reason} onChange={setReason} required />
          </div>
          <div className="mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Add closure day"}
            </Button>
          </div>
        </form>

        <div>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Closure days</h2>
          {loading ? (
            <p className="text-sm text-[#64748B]">Loading...</p>
          ) : (
            <DataTable
              columns={columns}
              rows={dates}
              rowKey={(c) => c.id}
              emptyMessage="No closure days set"
            />
          )}
        </div>
      </div>
    </div>
  );
}
