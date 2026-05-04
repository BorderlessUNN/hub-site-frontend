import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function BookTime() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl rounded-[32px] border border-[#C7D2FE] bg-white p-6 shadow-xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <img
            src="/borderless_logo.jpg"
            alt="Borderless logo"
            className="mx-auto mb-6 h-20 w-auto object-contain"
          />
          <h1 className="text-3xl font-bold text-[#0F172A]">Book a Seat</h1>
          <p className="mt-3 text-base text-[#475569] max-w-xl">
            This is a mock booking experience for non-members. It surfaces the core flow and keeps the page light and conversion-focused.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#FFDD00] bg-[#FEF3C7] p-5 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[#92400E]">Step 1</p>
            <h2 className="mt-3 text-xl font-semibold text-[#92400E]">Choose your plan</h2>
            <p className="mt-2 text-sm text-[#92400E]">Pick an hourly or full-day option for your workspace.</p>
          </div>
          <div className="rounded-3xl border border-[#CBD5E1] bg-[#F8FAFC] p-5 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[#334155]">Step 2</p>
            <h2 className="mt-3 text-xl font-semibold text-[#0F172A]">Enter details</h2>
            <p className="mt-2 text-sm text-[#475569]">Provide your name, email, and phone so your booking is ready.</p>
          </div>
          <div className="rounded-3xl border border-[#CBD5E1] bg-[#EFF6FF] p-5 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[#1D4ED8]">Step 3</p>
            <h2 className="mt-3 text-xl font-semibold text-[#1D4ED8]">Confirm booking</h2>
            <p className="mt-2 text-sm text-[#475569]">Complete the flow with a fast checkout screen later in integration.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
           <motion.button
             whileHover={{ y: -2 }}
             whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/nonMemberLogin")}
             className="rounded-lg bg-[#FFDD00] px-6 py-3 text-sm font-semibold text-[#04252D] transition"
           >
             Book a seat
           </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="rounded-lg bg-[#04252D] px-6 py-3 text-sm font-semibold text-white transition"
          >
            Back to home
          </motion.button>
        </div>

        <p className="mt-8 text-center text-xs text-[#64748B]">
          Mock booking page — this screen is a placeholder for the non-member booking flow. Backend integration comes later.
        </p>
      </div>
    </div>
  );
}
