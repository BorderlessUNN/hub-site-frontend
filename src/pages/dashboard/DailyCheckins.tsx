import { useEffect, useState } from "react";
import HeaderProps from "../../componeents/dashboard/HeaderPros";
import Button from "../../componeents/ui/Button";
import StatusBadge from "../../componeents/ui/StatusBadge";
import { extendNonMemberSession } from "../../../services/apis/checkin";
import {
  dailyCheckinsReport,
  type DailyCheckinRow,
} from "../../../services/apis/reports";

function today(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function minutesLeft(seconds?: number | null): string {
  if (seconds == null) return "—";
  if (seconds <= 0) return "expired";
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

export default function DailyCheckins() {
  const [date, setDate] = useState(today());
  const [data, setData] = useState<{
    active_members: DailyCheckinRow[];
    partial_members: DailyCheckinRow[];
    expired_users: DailyCheckinRow[];
    non_members: DailyCheckinRow[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load(d: string) {
    setLoading(true);
    setError("");
    try {
      const res = await dailyCheckinsReport(d);
      setData(res.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(today());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleExtend(checkinId: string) {
    const input = window.prompt("Extend by how many hours?", "1");
    if (!input) return;
    const hours = Number(input);
    if (!hours || hours < 1) return;
    setError("");
    setMessage("");
    try {
      await extendNonMemberSession({ checkin_id: checkinId, additional_hours: hours });
      setMessage("Session extended.");
      load(date);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  function Section({
    title,
    rows,
    tone,
    kind,
  }: {
    title: string;
    rows: DailyCheckinRow[];
    tone: "active" | "partial" | "expired" | "neutral";
    kind: "member" | "partial" | "expired" | "nonmember";
  }) {
    return (
      <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#0F172A]">{title}</h2>
          <StatusBadge label={`${rows.length}`} tone={tone} />
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">None</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Name</th>
                  <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Phone</th>
                  {kind === "nonmember" ? (
                    <>
                      <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Time left</th>
                      <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Actions</th>
                    </>
                  ) : (
                    <th className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Note</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.checkin_id} className="border-b border-[#F1F5F9] last:border-0">
                    <td className="px-4 py-2 text-[#0F172A]">{r.name}</td>
                    <td className="px-4 py-2 text-[#0F172A]">{r.phone_number || "—"}</td>
                    {kind === "nonmember" ? (
                      <>
                        <td className="px-4 py-2">
                          {r.is_expired ? (
                            <StatusBadge label="expired" tone="expired" />
                          ) : r.is_nearing_expiry ? (
                            <StatusBadge label={minutesLeft(r.remaining_seconds)} tone="warning" />
                          ) : (
                            <span className="text-[#0F172A]">{minutesLeft(r.remaining_seconds)}</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          {r.end_time ? (
                            <span className="text-[#94A3B8]">Checked out</span>
                          ) : (
                            <button
                              onClick={() => handleExtend(r.checkin_id)}
                              className="text-sm font-semibold text-[#04252D] hover:underline"
                            >
                              Extend
                            </button>
                          )}
                        </td>
                      </>
                    ) : (
                      <td className="px-4 py-2">
                        {kind === "partial" && r.is_nearing_cutoff ? (
                          <StatusBadge label="Cutoff soon" tone="warning" />
                        ) : (
                          <span className="text-[#64748B]">{r.status}</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <HeaderProps currentPage="Today's Check-ins" />
      <div className="p-6 flex-1 space-y-6">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block text-sm font-semibold text-[#334155]">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 block rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
            />
          </label>
          <Button onClick={() => load(date)} disabled={loading}>
            {loading ? "Loading..." : "View"}
          </Button>
        </div>

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

        {data ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Active members" rows={data.active_members} tone="active" kind="member" />
            <Section title="Partial-access members" rows={data.partial_members} tone="partial" kind="partial" />
            <Section title="Non-members" rows={data.non_members} tone="neutral" kind="nonmember" />
            <Section title="Expired" rows={data.expired_users} tone="expired" kind="expired" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
