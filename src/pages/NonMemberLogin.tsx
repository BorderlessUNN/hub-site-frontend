import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { mockNonMemberLogins } from "../mock/auth";

export default function NonMemberLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/^0\d{10}$/.test(phone.trim())) {
      setError("Please enter a valid 11-digit Nigerian phone number.");
      return;
    }

    // Mock authentication - check against mock non-member logins
    const mockLogin = mockNonMemberLogins.find(
      (login) => login.email === email && login.phone === phone
    );

    if (!mockLogin) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setError("Invalid login details. Please use a registered guest account.");
      }, 800);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(`Welcome, ${mockLogin.name}! Login successful.`);
      setTimeout(() => navigate("/dashboard/nonMember"), 1000);
    }, 800);
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
          <h1 className="text-2xl font-bold text-[#04252D]">Non-Member Login</h1>
          <p className="mt-2 text-sm text-[#64748B]">Enter your details to book a seat and access the workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-[#334155]">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
          />

          <label className="block text-sm font-semibold text-[#334155]">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
          />

          <label className="block text-sm font-semibold text-[#334155]">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            {loading ? "Logging in..." : "Book a Seat"}
          </motion.button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        {success ? <p className="mt-4 text-sm text-green-600">{success}</p> : null}

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
