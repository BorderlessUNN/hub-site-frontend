import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockFirstTimePhones, mockMemberDetails } from "../mock/auth";

export default function MemberLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [flow, setFlow] = useState<"idle" | "firstTime" | "returning">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState("");
  const navigate = useNavigate();

  const handlePhoneSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalized = phone.trim();
    if (!/^0\d{10}$/.test(normalized)) {
      setError("Enter a valid 11-digit phone number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const hasStoredPassword = localStorage.getItem(`member_password_${normalized}`);
      const firstTime = mockFirstTimePhones.includes(normalized) || !hasStoredPassword;

      setFlow(firstTime ? "firstTime" : "returning");
      setMessage(
        firstTime
          ? "First-time login detected. Create your password."
          : "Welcome back. Enter your password to continue."
      );
      setCurrentPhone(normalized);
      setPassword("");
      setConfirmPassword("");
    }, 500);
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (flow === "firstTime") {
      if (!password || !confirmPassword) {
        setError("Enter and confirm your password.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      localStorage.setItem(`member_password_${currentPhone}`, password);
      setMessage("Password created successfully. Redirecting...");
      setTimeout(() => navigate("/dashboard/isMember"), 800);
      return;
    }

    if (flow === "returning") {
      if (!password) {
        setError("Enter your password.");
        return;
      }
      const storedPassword = localStorage.getItem(`member_password_${currentPhone}`);
      if (storedPassword && password === storedPassword) {
        setMessage("Mock sign-in successful. Redirecting...");
        setTimeout(() => navigate("/dashboard/isMember"), 800);
      } else {
        setError("Incorrect password.");
      }
      return;
    }

    setError("Please submit your phone number first.");
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-[28px] border border-[#FFDD00] bg-white p-6 shadow-lg sm:p-10">
        <div className="text-center">
          <img
            src="/avatar.jpg"
            alt="Avatar"
            className="mx-auto mb-6 h-[94px] w-[82px] lg:h-[144px] lg:w-[125px]"
          />
          <img src="/logo.png" alt="Borderless logo" className="mx-auto mb-6 h-12 w-auto object-contain" />
          <h1 className="text-2xl font-bold text-[#04252D]">{mockMemberDetails.title}</h1>
          <p className="mt-2 text-sm text-[#64748B]">{mockMemberDetails.description}</p>
        </div>

        {flow === "idle" ? (
          <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-[#334155]">Phone number</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="08012345678"
              className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
              inputMode="numeric"
            />

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full rounded-lg bg-[#FFDD00] px-5 py-3 text-sm font-semibold text-[#04252D] transition"
              disabled={loading}
            >
              {loading ? "Checking..." : "Continue"}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-[#334155]">Phone</label>
            <input
              value={phone}
              readOnly
              className="w-full rounded-2xl border border-[#CBD5E1] bg-[#E2E8F0] px-4 py-3 text-base text-[#475569]"
            />

            <label className="block text-sm font-semibold text-[#334155]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create password"
              className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
            />

            {flow === "firstTime" && (
              <>
                <label className="block text-sm font-semibold text-[#334155]">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
                />
              </>
            )}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full rounded-lg bg-[#04252D] px-5 py-3 text-sm font-semibold text-white transition"
            >
              {flow === "firstTime" ? "Create Password" : "Sign In"}
            </motion.button>
          </form>
        )}

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        {message && flow !== "idle" ? <p className="mt-4 text-sm text-green-600">{message}</p> : null}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 text-sm text-[#64748B] underline"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
