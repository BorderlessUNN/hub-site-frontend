import CheckIns from "./dashboard/CheckInsPage";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlans } from "../../services/apis/plans";
import type { Plan } from "../../services/apis/plans";
import { recordOfflinePayment } from "../../services/apis/subscription";
import { createCheckIn } from "../../services/apis/checkin";
import { FaArrowLeft } from "react-icons/fa";

type availablePlan = {
  expires_at: Date;
  seat_id: string;
};
export default function NonMember({
  email,
  email_handler,
  available_plan_handler,
}: {
  email: string;
  email_handler: (email: string) => void;
  available_plan_handler: (plan: availablePlan[]) => void;
}) {
  const navigate = useNavigate();
  const [hourlyPlan, setHourlyPlan] = useState<Plan | null>(null);
  const [hours, setHours] = useState<number>(1);
  const [disable_payment, set_disable_payment] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error_message, set_error_message] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await getPlans({ signal: controller.signal });
        const nonMemberPlan = res.data.find((p) => !p.is_member_only) || null;
        setHourlyPlan(nonMemberPlan);
      } catch (error: unknown) {
        set_error_message((error as Error).message);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const total = hourlyPlan ? hourlyPlan.price * hours : 0;

  async function handleRecordPayment() {
    if (!hourlyPlan) return;
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      set_error_message("No captured non-member found. Capture their details first.");
      return;
    }
    if (hours < 1) {
      set_error_message("Enter at least 1 hour.");
      return;
    }
    set_error_message("");
    setProcessing(true);
    try {
      await recordOfflinePayment({
        user_id,
        plan_id: hourlyPlan.id,
        hours,
      });
      const seat_id = localStorage.getItem("seat_id") || "";
      const expires_at = new Date(Date.now() + hours * 60 * 60 * 1000);
      available_plan_handler([{ expires_at, seat_id }]);
      set_disable_payment(false);
    } catch (error: unknown) {
      set_error_message((error as Error).message);
    } finally {
      setProcessing(false);
    }
  }

  const paymentMade = async () => {
    // The payment activated their subscription; now record their session
    // check-in so the hourly countdown starts.
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      try {
        await createCheckIn({ user_id });
      } catch {
        // Non-fatal: payment already recorded.
      }
    }
    navigate("/dashboard/paymentMade");
  };

  return (
    <div className="relative">
      <CheckIns email={email} email_handler={email_handler}>
        <div>
          <motion.div
            className=" absolute flex flex-col justify-center items-center w-full bg-white z-10  bottom-0 lg:max-h-[576px] lg:max-w-[800px] lg:top-[123px] lg:mx-auto border-1 shadow-2xl border-yellow-400 border-solid rounded lg:pt-[15px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute top-4 left-6 flex items-center cursor-pointer"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard/check-ins")}
            >
              <FaArrowLeft className="mr-2" size={18} />
              <span>Back</span>
            </motion.div>
            <img
              className="h-[52px] w-[43px] mt-[39px] mb-[20px] lg:w-[71px] lg:h-[85px] lg:mb-[25px] lg:mt-[15px]"
              src="/borderless_logo.jpg"
            ></img>

            <div className="flex flex-row justify-center items-center mb-[14px] lg:mb-[18px]">
              <h1 className=" text-[15px] lg:text-xl font-bold">Not a MEMBER</h1>
              <img
                src="/redChecked.jpg"
                className="w-[23px] h-[23px] mb-[14px] lg:w-[33px] lg:h-[33px]"
              ></img>
            </div>
            <p className="text-center text-[13px] mb-[27px] lg:text-[25px] lg:mb-[30px]">
              {" "}
              Make a payment
            </p>

            {error_message ? (
              <p className="text-center text-red-400 text-[16px] mb-3 px-6">
                {error_message}
              </p>
            ) : (
              <p className="text-center text-green-500 text-[16px] mb-3">
                {`₦${hourlyPlan?.price ?? 400} per hour`}
              </p>
            )}

            <div className="flex flex-col items-center w-full px-8 mb-[40px] lg:mb-[55px] max-w-[520px]">
              <label className="w-full text-left text-sm font-semibold text-[#334155] mb-2">
                Number of hours
              </label>
              <input
                type="number"
                min={1}
                value={hours}
                onChange={(e) => {
                  setHours(Math.max(1, Number(e.target.value) || 1));
                  set_disable_payment(true);
                }}
                className="w-full rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-base outline-none transition focus:border-[#FFDD00] mb-5"
              />

              <div className="flex w-full items-center justify-between rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 mb-6">
                <span className="text-sm text-[#475569]">Total to pay</span>
                <span className="text-xl font-bold text-[#04252D]">₦{total}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ backgroundColor: "#F4C400" }}
                onClick={handleRecordPayment}
                disabled={processing || !hourlyPlan}
                className={`bg-[#FFDD00] text-[#04252D] font-semibold w-full h-[46px] rounded-lg mb-4 ${
                  processing || !hourlyPlan
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {processing ? "Recording payment..." : "Record cash payment"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
                whileHover={{ backgroundColor: "#F4C400" }}
                onClick={paymentMade}
                disabled={disable_payment}
                className={`bg-[#04252D] text-white w-full h-[46px] rounded-lg ${
                  disable_payment
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                Payment Made
              </motion.button>
              <p className="text-center text-[13px] mt-4 lg:text-[15px] text-[#475569]">
                They now have access to make use of the Borderless web3 product house
              </p>
            </div>
          </motion.div>
        </div>
      </CheckIns>
    </div>
  );
}
