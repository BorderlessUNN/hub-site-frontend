import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/authContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [showpassword, setshowpassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [errorMessage, setErroMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  function inputValidator() {
    if (email == "" || password == "") {
      setErroMessage("fill in all fields");
      return false;
    } else return true;
  }
  const logIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValidator()) return;
    setloading(true);
    try {
      await login({ email, password });
      navigate("/dashboard/check-ins");
    } catch (error: any) {
      setErroMessage(error.message);
    } finally {
      setloading(false);
    }
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
          <img
            src="/logo.png"
            alt="Borderless logo"
            className="mx-auto mb-6 h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-[#04252D]">Admin Login</h1>
          <p className="mt-2 text-sm text-[#64748B]">
            Enter your admin credentials to access the dashboard.
          </p>
        </div>

        <form onSubmit={logIn} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-[#334155]">Email</label>
          <input
            id="email"
            placeholder="Enter your email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
            type="text"
          />

          <label className="block text-sm font-semibold text-[#334155]">Password</label>
          <div className="relative">
            <input
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00]"
              type={`${showpassword ? "text" : "password"}`}
            />
            <button
              type="button"
              onClick={() => setshowpassword(!showpassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#475569]"
            >
              {showpassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-500">{errorMessage}</p>
          ) : null}

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`${loading && "opacity-50 cursor-not-allowed"} w-full rounded-lg bg-[#04252D] px-5 py-3 text-sm font-semibold text-white transition`}
          >
            {loading ? "Logging in..." : "Log in"}
          </motion.button>
        </form>

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
