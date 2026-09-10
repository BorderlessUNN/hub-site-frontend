import { useEffect, useState } from "react";
import HeaderProps from "../../componeents/dashboard/HeaderPros";
import Button from "../../componeents/ui/Button";
import { paymentsReport } from "../../../services/apis/reports";

type ReportData = {
  month: string;
  full_payments: { count: number; total: number };
  installment_payments: { count: number; total: number };
  first_installments: { count: number; total: number };
  second_installments: { count: number; total: number };
  completed_installment_pairs: number;
  grand_total: number;
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">{label}</p>
      <p className="mt-3 text-2xl font-bold text-[#0F172A]">{value}</p>
    </div>
  );
}

function currentMonth(): string {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${m}`;
}

export default function RevenueReport() {
  const [month, setMonth] = useState(currentMonth());
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(selectedMonth: string) {
    setLoading(true);
    setError("");
    try {
      const res = await paymentsReport(selectedMonth);
      setData(res.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col">
      <HeaderProps currentPage="Revenue" />
      <div className="p-6 flex-1 space-y-8">
        <div className="flex flex-wrap items-end gap-4">
          <label className="block text-sm font-semibold text-[#334155]">
            Month
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-2 block rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
            />
          </label>
          <Button onClick={() => load(month)} disabled={loading}>
            {loading ? "Loading..." : "View report"}
          </Button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
            {error}
          </div>
        ) : null}

        {data ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Grand total" value={`₦${data.grand_total.toLocaleString()}`} />
              <StatCard
                label="Full payments"
                value={`${data.full_payments.count} · ₦${data.full_payments.total.toLocaleString()}`}
              />
              <StatCard
                label="Installment payments"
                value={`${data.installment_payments.count} · ₦${data.installment_payments.total.toLocaleString()}`}
              />
              <StatCard
                label="Completed installment pairs"
                value={`${data.completed_installment_pairs}`}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                label="First installments"
                value={`${data.first_installments.count} · ₦${data.first_installments.total.toLocaleString()}`}
              />
              <StatCard
                label="Second installments"
                value={`${data.second_installments.count} · ₦${data.second_installments.total.toLocaleString()}`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
