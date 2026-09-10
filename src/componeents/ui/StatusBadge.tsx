// Maps subscription/session states to a coloured pill, reused across
// reporting, check-in, and member dashboard screens.

type Tone = "active" | "partial" | "expired" | "pending" | "warning" | "neutral";

const toneClasses: Record<Tone, string> = {
  active: "bg-[#ECFDF5] text-[#166534] border border-[#A7F3D0]",
  partial: "bg-[#FEF9C3] text-[#854D0E] border border-[#FDE68A]",
  expired: "bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]",
  pending: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
  warning: "bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA]",
  neutral: "bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]",
};

function statusToTone(status: string): Tone {
  const s = status.toLowerCase();
  if (s.includes("expired")) return "expired";
  if (s.includes("partial")) return "partial";
  if (s.includes("active")) return "active";
  if (s.includes("pending")) return "pending";
  if (s.includes("failed")) return "expired";
  return "neutral";
}

export default function StatusBadge({
  status,
  tone,
  label,
}: {
  status?: string;
  tone?: Tone;
  label?: string;
}) {
  const resolvedTone = tone ?? statusToTone(status ?? "");
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[resolvedTone]}`}
    >
      {label ?? status ?? ""}
    </span>
  );
}
