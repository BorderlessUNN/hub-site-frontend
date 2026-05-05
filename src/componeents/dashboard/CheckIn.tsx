import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useCheckInAuth } from "../../context/checkInContext";

export default function CheckIn({
  children,
  email,
  email_handler,
}: {
  children?: React.ReactNode;
  email: string;
  email_handler: (email: string) => void;
}) {
  const [loading, setloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { checkin } = useCheckInAuth();

  function inputValidator() {
    if (email == "") {
      setErrorMessage("enter details");
      return false;
    } else return true;
  }

  const checkIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValidator()) return;
    setloading(true);
    try {
      const user = await checkin({ email });
      if (user.status == false) {
        navigate("/dashboard/enterDetails", { replace: true });

        localStorage.setItem("status", "non_member");
      } else {
        const user_details = user.data;
        localStorage.setItem("name", user_details.name);
        localStorage.setItem("user", user_details.email);
        localStorage.setItem("user_id", user_details.id);
        localStorage.setItem("status", "member");
        if (user_details.is_member) {
          navigate("/dashboard/profile");
        } else {
          localStorage.setItem("status", "non_member");
          navigate("/dashboard/enterDetails", { replace: true });
        }
      }
    } catch (error: any) {
      setErrorMessage(
        `${
          error.message == "failed to fetch" ? "network error" : error.message
        }`
      );
    } finally {
      setloading(false);
    }
  };

  return (
    <div className=" relative">
      <div className="relative flex flex-col  w-full overflow-auto ">
        <div className="flex flex-col ml-3 lg:ml-5">
          <p className=" mb-2 lg:mb-4"> Check in </p>
          <form onSubmit={checkIn} className="flex flex-row">
            <input
              id="email"
              placeholder="Email..."
              type="email"
              onChange={(e) => email_handler(e.target.value)}
              value={email}
              className=" placeholder:opacity-50 placeholder:text-sm placeholder:italic w-[250px] h-[20px] mr-3 mb-2 lg:mb-4 p-[10px] lg:w-[400px] lg:h-[42px] border-1 border-[#FFDD00] border-solid rounded"
            ></input>
            <p className="text-red-500 mb-[10px] text-[20px]">{errorMessage}</p>
            <motion.button
              whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
              whileHover={{ backgroundColor: "#F4C400" }}
              transition={{ type: "spring", stiffness: "300" }}
              className={`  ${
                loading && "opacity-50 cursor-not-allowed"
              }h-[21px] w-fit  text-center p-[10px] mr-2 lg:h-[47px] bg-[#FFDD00] border-1 border-[#FFDD00] border-solid rounded ${
                children ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!!children}
            >
              {" "}
              {loading ? "Processsing..." : "Check In"}
            </motion.button>
          </form>
        </div>
      </div>{" "}
      {children}
    </div>
  );
}
