import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F5EC] text-[#0F172A] px-6 py-4 sm:px-6 sm:py-4 lg:px-6 lg:py-5">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 lg:gap-6">
        <header className="flex items-center justify-between rounded-3xl border border-[#FFDD00] bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm sm:px-8">
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <img src="/borderless_logo.jpg" alt="Borderless logo" className="h-10 w-auto object-contain" />
            <span className="font-semibold">Borderless</span>
            <span className="hidden sm:inline text-[#64748B] font-semibold">Tech club UNN</span>
          </div>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm sm:hidden">
            <img src="/menu.png" alt="Menu" className="h-6 w-6" />
          </button>
        </header>

        <main className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center mt-12 lg:mt-8">
          <div className="flex flex-col justify-center space-y-4 lg:space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-[#94A3B8]">BTC UNN</p>
            <h1 className="text-lg leading-tight text-[#04252D] sm:text-xl">
              <strong className="font-bold">BTC UNN</strong> is a student-based Web3 community focused on fostering growth, training tech enthusiasts, and bringing them on-chain.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-[#475569] sm:text-base">
              Welcome members and non-members.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/login")}
                className="rounded-lg bg-[#FFDD00] px-5 py-3 text-sm font-semibold text-[#04252D] shadow-sm transition duration-200 hover:shadow-md"
              >
                Member Log In
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/book-time")}
                className="rounded-lg bg-[#04252D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#091b25]"
              >
                Book Time
              </motion.button>
            </div>

            <button
              onClick={() => navigate("/admin/login")}
              className="mt-2 w-fit text-sm font-semibold text-[#64748B] underline underline-offset-4 transition hover:text-[#04252D]"
            >
              Admin Portal
            </button>
          </div>

           <div className="flex justify-center lg:justify-end">
             <img
               src="/avatar.jpg"
               alt="Borderless mock profile"
               className="h-[340px] max-w-md rounded-2xl border border-[#E2E8F0] object-contain sm:h-[380px] lg:h-[460px]"
             />
           </div>
        </main>
      </div>
    </div>
  );
}
