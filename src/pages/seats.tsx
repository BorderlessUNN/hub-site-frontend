import { RefreshCw } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { useCheckInAuth } from "../context/checkInContext";
import { FaArrowLeft } from "react-icons/fa";
import { bookSeat } from "./../../services/apis/seat";
import { seatState } from "./../../services/apis/seat";
import { checkOutSeat } from "./../../services/apis/seat";
import { createCheckIn } from "./../../services/apis/checkin";

type BookSeat = {
  seat_id: string;
  user_id: string;
};
type Seats = {
  id: string;
  seat_number: number;
  is_taken: boolean;
};
export default function Seats() {
  const [refresh, setRefresh] = useState(0);
  const [booked_seat, setbooked_seat] = useState<BookSeat>();
  const [display_box, setDisplay_box] = useState(false);
  const [visible, set_visible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [current_seat, setcurrent_seat] = useState<Seats>();
  const navigate = useNavigate();
  const [seat, setSeat] = useState<Seats[]>([]);
  const [success_msg, set_success_msg] = useState("");

  // const { user } = useCheckInAuth();
  const user_id = localStorage.getItem("user_id");

  const start_timer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      set_visible(false);
    }, 2000);
  };

  useEffect(() => {
    try {
      const controller = new AbortController();

      const fetchSeat = async () => {
        const res = await seatState({ signal: controller.signal });
        const aval_seat = res.data;

        setSeat(aval_seat);
      };

      fetchSeat();
      return () => controller.abort();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted, no worries.");
      } else console.log("seat error", error);
    }
  }, [refresh]);

  async function checkOut(data: { seat_id: string }) {
    const res = await checkOutSeat(data);

    return res;
  }
  async function bookseat(data: { seat_id: string; user_id: string }) {
    const res: any = await bookSeat(data);
    return res;
  }

  const proceed = async () => {
    const identity = localStorage.getItem("status");
    if (!booked_seat || !current_seat) return;
    // Record attendance against the active subscription for members here;
    // non-members are checked in after their payment is recorded.
    if (identity == "member" && user_id) {
      try {
        await createCheckIn({ user_id });
      } catch {
        // Non-fatal: seat booking already succeeded.
      }
      navigate("/dashboard/check-ins");
    }
    if (identity == "non_member") navigate("/dashboard/nonMember");
  };
  function seatRow(seatNum1: Seats, seatNum2: Seats) {
    return (
      <div className="flex flex-row ">
        {[seatNum1, seatNum2].map((seat, id) => (
          <div
            className={`flex flex-col mb-[29px] mr-[19px] lg:mb-[18px] lg:mr-[23px] cursor-pointer transition-transform duration-300 transform hover:scale-110 active:scale-105 hover:shadow-lg active:shadow-md   hover:border-gray-300 ${
              seat.is_taken && "opacity-50 "
            }`}
            key={id}
            onClick={() => {
              setcurrent_seat({
                id: seat.id,
                seat_number: seat.seat_number,
                is_taken: seat.is_taken,
              });
              setDisplay_box(true);
            }}
          >
            <p className="text-center">{seat.seat_number}</p>
            <img
              className="w-[30px] h-[30px] mb-[11px] mt-[3px] lg:w-[42px] lg:h-[42px] lg:mt-[19.11px] lg:mb-[21.5px] "
              src="/chair.png"
            ></img>
            {seat.is_taken ? (
              <img
                className="w-[16px] h-[16px] lg:w-[20.13px] lg:h-[20.13px]"
                src={`${seat.is_taken ? "/checked.jpg" : "/redChecked.jpg"}`}
              ></img>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    );
  }
  if (seat.length < 10) {
    return (
      <div className=" absolute text-center top-40 left-1/2 text-lg font-bold text-[29px]">
        Loading seats...
      </div>
    );
  }

  const dialog_box = (
    <motion.div
      className="absolute top-40 mx-auto
             flex flex-col justify-center items-center bg-white 
             w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto 
             border-2 border-yellow-400 rounded-lg p-6 shadow-xl z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute top-4 left-6 flex items-center cursor-pointer"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setDisplay_box(false)}
      >
        <FaArrowLeft className="mr-2" size={18} />
        <span>Back</span>
      </motion.div>
      <img
        className="h-[52px] w-[43.26px] mt-[15px] mb-[21px] lg:w-[71px] lg:h-[85px] lg:mb-[25px] lg:mt-[15px]"
        src="/borderless_logo.jpg"
      ></img>

      <div className="flex flex-row justify-center items-center mb-[38px] lg:mb-[64px]">
        <h1 className="text-[15px]  lg:font-bold">member</h1>
        <img
          src="/checked.jpg"
          className="w-[23px] h-[23px] lg:w-[33px] lg:h-[33px]"
        ></img>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <motion.button
          onClick={() => {
            if (!user_id) {
              set_success_msg("Please Go to Check in before booking a seat");
              return;
            }
            if (current_seat?.is_taken) {
              return;
            }
            bookseat({ user_id: user_id, seat_id: current_seat?.id! });
            setbooked_seat({ user_id: user_id, seat_id: current_seat?.id! });
            setSeat((prev) =>
              prev.map((s) =>
                s.id === current_seat?.id ? { ...s, is_taken: true } : s
              )
            );
            set_success_msg(
              `Seat ${current_seat?.seat_number} is booked successfully`
            );
            set_visible(true);
            start_timer();
          }}
          disabled={!user_id || current_seat?.is_taken}
          whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
          whileHover={{ backgroundColor: "#F4C400" }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`bg-[#FFDD00] text-[15px] font-bold items-center w-[100px] h-[35px] mb-[33px] lg:w-[250px] lg:h-[59px] lg:text-[25px]  lg:mx-auto lg:mb-[48px] ${
            current_seat?.is_taken
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          {" "}
          Book Seat
        </motion.button>
        <motion.button
          onClick={() => {
            checkOut({ seat_id: current_seat?.id! });
            setSeat((prev) =>
              prev.map((s) =>
                s.id === current_seat?.id ? { ...s, is_taken: true } : s
              )
            );
            set_success_msg(
              `Seat ${current_seat?.seat_number} Checked out successfully`
            );
            set_visible(true);
            start_timer();
          }}
          disabled={!current_seat?.seat_number || !current_seat?.is_taken}
          whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
          whileHover={{ backgroundColor: "#F4C400" }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`bg-[#FFDD00] text-[15px] font-bold items-center w-[100px] h-[35px] mb-[33px]  lg:w-[250px] lg:h-[59px] lg:text-[25px]  lg:mx-auto lg:mb-[48px] ${
            !current_seat?.is_taken
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          {" "}
          Check Out
        </motion.button>
      </div>
      <p className="text-center mb-[46px] lg:mr-[23.57px] lg:ml-[27px] lg:text-[17px]">
        You now have access to make use of the Borderless <br /> web3 product
        house
      </p>
    </motion.div>
  );

  const successful = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className={`block ${
        !visible && "hidden"
      } absolute shadow-2xl p-5 right-5 top-20 bg-red-200`}
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }}
      onMouseLeave={() => start_timer()}
    >
      <img></img>
      <p className="text-center font-bold text-black text-[18px] mb-2">
        {success_msg}
      </p>
    </motion.div>
  );

  return (
    <div>
      <div className="relative">
        <motion.div
          className="flex flex-col mt-30 lg:flex-row md:flex-row pt-6 bg-white border border-yellow-400 
             rounded-lg shadow-2xl mx-auto
             w-full max-w-[1000px] lg:max-h-[682px] "
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-2 left-5 lg:left-8 flex items-center cursor-pointer"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard/check-ins")}
          >
            <FaArrowLeft className="mr-2" size={18} />
            <span className="text-[12px] lg:text-[15px]">Back</span>
          </motion.div>
          <div className=" block md:hidden lg:hidden bg-white  py-2">
            <h1 className="text-[15px] mt-[34px] font-bold text-center">
              Sitting Arrangement
            </h1>
            <p className="text-[15px] mt-[20px] text-center">Get a set</p>
          </div>
          <div className="flex flex-row  md:mt-2 lg:mt-[15px]">
            <div className="flex flex-col ml-[25px] mr-[87px] lg:mr-[148px] lg:ml-[137px]">
              {seatRow(seat[0], seat[1])}
              {seatRow(seat[4], seat[5])}
              {seatRow(seat[8], seat[9])}
            </div>
            <div className="flex flex-col">
              {seatRow(seat[2], seat[3])}
              {seatRow(seat[6], seat[7])}
            </div>
          </div>

          <div className="flex flex-col items-center  mt-[20px] lg:mt-[238px] md:ml-20 lg:ml-5">
            <RefreshCw
              onClick={() => setRefresh((prev) => prev + 1)}
              size={20}
              className="cursor-pointer w-6 h-6 text-black mb-[10px] hover:text-yellow-500 transition"
            />
            <motion.button
              whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
              whileHover={{ backgroundColor: "#F4C400" }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={proceed}
              className={`w-[111px] h-[35px] mx-auto mb-[18px] lg:w-[182px] lg:h-[59px] cursor-pointer bg-[#FFDD00] border-1 border-[#FFDD00] border-solid rounded lg:mx-auto lg:mb-[50px] ${
                !booked_seat && "cursor-not-allowed opacity-50"
              }`}
            >
              Proceed
            </motion.button>
            <p className=" text-[10px] mb-[27px] lg:text-[17px] text-center">
              You now have access to make use of the Borderless <br /> web3
              product house
            </p>
          </div>
        </motion.div>
        <div className="flex items-center justify-center z-40">
          {" "}
          {display_box && dialog_box}
        </div>

        {visible && successful}
      </div>
    </div>
  );
}
