import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/apis/auth";
import {
  listSubscriptions,
  createMemberSubscription,
  type Subscription,
} from "../../services/apis/subscription";
import { getPlans, listPayments, type PaymentRecord } from "../../services/apis/plans";
import StatusBadge from "../componeents/ui/StatusBadge";
import Button from "../componeents/ui/Button";

const OPEN_STATUSES = ["Pending", "Partial Active", "Active"];

type Profile = {
  id: string;
  user_name: string;
  email: string;
  phone_number: string | null;
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

// forceEditMode is accepted for route compatibility but member profiles are
// admin-managed and read-only here.
export default function Member({ forceEditMode = false }: { forceEditMode?: boolean }) {
  void forceEditMode;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [installmentPlanId, setInstallmentPlanId] = useState<string | null>(null);
  const [fullPlanId, setFullPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const memberSession = localStorage.getItem("member_session_phone");

  useEffect(() => {
    if (!memberSession) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const [meRes, subsRes, paymentsRes, plansRes] = await Promise.all([
          getMe(),
          listSubscriptions(),
          listPayments(),
          getPlans(),
        ]);
        if (cancelled) return;

        const me: Profile = {
          id: meRes.data.id,
          user_name: meRes.data.user_name,
          email: meRes.data.email,
          phone_number: meRes.data.phone_number,
        };
        setProfile(me);

        const mine = subsRes.data
          .filter((s) => s.user === me.id)
          .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
        setSubscription(mine[0] ?? null);

        setPayments(paymentsRes.data.filter((p) => p.user_id === me.id));

        const installment = plansRes.data.find(
          (p) => p.is_member_only && p.is_paid_in_installment
        );
        const full = plansRes.data.find(
          (p) => p.is_member_only && !p.is_paid_in_installment
        );
        setInstallmentPlanId(installment?.id ?? null);
        setFullPlanId(full?.id ?? null);
      } catch (err: unknown) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [memberSession]);

  async function startSubscription(planId: string | null, installment: "1" | "2" | null) {
    if (!profile || !planId) return;
    setActionLoading(true);
    setError("");
    try {
      const res = await createMemberSubscription({
        user_id: profile.id,
        plan_id: planId,
        installment_number: installment,
      });
      const data = (res as { data?: { authorization_url?: string } }).data;
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setError("Could not start the payment. Please try again.");
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  }

  if (!memberSession) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-[28px] border border-[#FFDD00] bg-white p-8 shadow-lg text-center">
          <h1 className="text-2xl font-bold text-[#04252D]">Member access</h1>
          <p className="mt-4 text-sm text-[#64748B]">
            Please sign in as a member first so we can load your profile and subscription details.
          </p>
          <div className="mt-8 flex justify-center">
            <Button onClick={() => navigate("/login")}>Go to member login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-6 py-12">
        <p className="text-sm text-[#64748B]">Loading your dashboard...</p>
      </div>
    );
  }

  const status = subscription?.status ?? "No subscription";
  const isPartial = subscription?.status === "Partial Active";
  const hasOpen = subscription ? OPEN_STATUSES.includes(subscription.status) : false;

  const amountPaid = payments
    .filter((p) => p.payment_status === "Success")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const total = 5000;
  const paymentProgress = Math.min(100, Math.round((amountPaid / total) * 100));
  const progressColor = subscription?.status === "Active" ? "#FFDD00" : "#EF4444";

  return (
    <div className="min-h-screen bg-[#F7F6F2] px-6 py-20 lg:px-10">
      <div className="mx-auto w-full max-w-6xl rounded-[28px] border border-[#E5E7EB] bg-white p-8 shadow-lg">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Member profile</p>
          <h1 className="mt-3 text-3xl font-bold text-[#0F172A]">Your member dashboard</h1>
          <p className="mt-2 text-sm text-[#64748B] max-w-2xl">
            Review your profile, subscription status and payment history from one place.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#FECACA] bg-[#FEE2E2] px-4 py-3 text-sm text-[#991B1B]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-[#94A3B8]">Profile</p>
            <h2 className="mt-2 text-xl font-semibold text-[#0F172A]">
              Welcome, {profile?.user_name || "Member"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Full Name</p>
                <p className="mt-2 font-semibold text-[#0F172A]">{profile?.user_name || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Email</p>
                <p className="mt-2 font-semibold text-[#0F172A]">{profile?.email || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Phone</p>
                <p className="mt-2 font-semibold text-[#0F172A]">{profile?.phone_number || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Membership</p>
                <p className="mt-2 font-semibold text-[#0F172A]">Community member</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E5E7EB] bg-[#F8FAFC] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Subscription</p>
              <StatusBadge status={status} />
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-[#475569]">Payment progress</p>
                <p className="mt-1 font-semibold text-[#0F172A]">{paymentProgress}%</p>
              </div>
              <div>
                <p className="text-sm text-[#475569]">Amount paid</p>
                <p className="mt-1 font-semibold text-[#0F172A]">₦{amountPaid} / ₦{total}</p>
              </div>
              <div>
                <p className="text-sm text-[#475569]">Expiry</p>
                <p className="mt-1 font-semibold text-[#0F172A]">
                  {isPartial
                    ? `Partial access until ${formatDate(subscription?.partial_expires_at ?? null)}`
                    : formatDate(subscription?.expires_at ?? null)}
                </p>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
                <div
                  style={{ width: `${paymentProgress}%`, backgroundColor: progressColor }}
                  className="h-full rounded-full"
                />
              </div>

              {isPartial ? (
                <div className="rounded-2xl border border-[#FDE68A] bg-[#FEF9C3] px-4 py-3 text-sm text-[#854D0E]">
                  Complete your second installment before {formatDate(subscription?.partial_expires_at ?? null)} to keep 30-day access.
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-2">
                {isPartial ? (
                  <Button
                    onClick={() => startSubscription(installmentPlanId, "2")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Redirecting..." : "Complete pending installment"}
                  </Button>
                ) : null}

                {!hasOpen ? (
                  <>
                    <Button
                      onClick={() => startSubscription(fullPlanId, null)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Redirecting..." : "Pay full ₦5,000 (30 days)"}
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => startSubscription(installmentPlanId, "1")}
                      disabled={actionLoading}
                    >
                      Start with ₦2,500 installment
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-[#64748B]">Payment history</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Amount</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Installment</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#94A3B8]">
                      No payments yet
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="px-4 py-3 text-[#0F172A]">{formatDate(p.created_at)}</td>
                      <td className="px-4 py-3 text-[#0F172A]">₦{p.amount}</td>
                      <td className="px-4 py-3 text-[#0F172A]">{p.payment_type}</td>
                      <td className="px-4 py-3 text-[#0F172A]">{p.installment_number || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={p.payment_status}
                          tone={
                            p.payment_status === "Success"
                              ? "active"
                              : p.payment_status === "Failed"
                              ? "expired"
                              : "pending"
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
