import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockMemberDetails } from "../mock/auth";
import {
  checkMemberHasPassword,
  setMemberPassword,
  memberLogin,
} from "../../services/apis/auth";

function storeMemberSession(
  phone: string,
  user: { id: string; name: string; email: string; phone_number: string },
  tokens: { access_token: string; refresh_token: string }
) {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
  localStorage.setItem("member_session_phone", phone);
  localStorage.setItem("member_id", user.id);
  localStorage.setItem("role", "member");
}

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

  const handlePhoneSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalized = phone.trim();
    if (!/^0\d{10}$/.test(normalized)) {
      setError("Enter a valid 11-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const res = await checkMemberHasPassword({ identifier: normalized });
      const hasPassword = res.data.has_password;
      setFlow(hasPassword ? "returning" : "firstTime");
      setMessage(
        hasPassword
          ? "Welcome back. Enter your password to continue."
          : "First-time login detected. Create your password."
      );
      setCurrentPhone(normalized);
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const body = (err as { body?: { not_a_member?: boolean } })?.body;
      if (body?.not_a_member) {
        setError("You are not a community member. Redirecting you to book a session...");
        setTimeout(() => navigate("/book-time"), 1500);
      } else {
        setError((err as Error).message || "Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (flow === "firstTime") {
      if (!password || !confirmPassword) {
        setError("Enter and confirm your password.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setLoading(true);
      try {
        await setMemberPassword({ identifier: currentPhone, password });
        const login = await memberLogin({ identifier: currentPhone, password });
        storeMemberSession(currentPhone, login.data.user, login.data.tokens);
        setMessage("Password created successfully. Redirecting...");
        setTimeout(() => navigate("/dashboard/profile"), 800);
      } catch (err: unknown) {
        setError((err as Error).message || "Could not set your password.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (flow === "returning") {
      if (!password) {
        setError("Enter your password.");
        return;
      }
      setLoading(true);
      try {
        const login = await memberLogin({ identifier: currentPhone, password });
        storeMemberSession(currentPhone, login.data.user, login.data.tokens);
        setMessage("Sign-in successful. Redirecting...");
        setTimeout(() => navigate("/dashboard/profile"), 800);
      } catch (err: unknown) {
        setError((err as Error).message || "Incorrect password.");
      } finally {
        setLoading(false);
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
             <div className="flex items-center gap-2">
              <label className="block text-sm font-semibold text-[#334155]">Phone</label>
              <span className="text-xs text-[#64748B]">({currentPhone})</span>
            </div>
            <input
              value={currentPhone}
              readOnly
              className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base text-[#04252D] font-medium"
            />

             <label className="block text-sm font-semibold text-[#334155]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
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
              disabled={loading}
            >
              {loading ? "Please wait..." : flow === "firstTime" ? "Create Password" : "Sign In"}
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
