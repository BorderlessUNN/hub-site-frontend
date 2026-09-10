import CheckIns from "./dashboard/CheckInsPage";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function PaymentMade({
  email,
  email_handler,
}: {
  email: string;
  email_handler: (email: string) => void;
}) {
  const navigate = useNavigate();

  const book_seat = () => {
    navigate("/dashboard/check-ins");
  };
  return (
    <div>
      <CheckIns email={email} email_handler={email_handler}>
        <motion.div
          className=" absolute flex flex-col justify-center items-center w-full bg-white z-10 left-0 right-0 bottom-0 lg:max-h-[476px] lg:max-w-[788px] lg:top-[143px]  lg:left-[362px] border-1 border-yellow-400 border-solid rounded lg:pt-[15px]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            className="h-[52px] w-[43.26px] mt-[15px] mb-[21px] lg:w-[71px] lg:h-[85px] lg:mb-[25px] lg:mt-[15px]"
            src="/borderless_logo.jpg"
          ></img>
          <div className="flex flex-row justify-center items-center mb-[20px] lg:mb-[18px]">
            <h1 className=" text-[15px] font-bold">Not a MEMBER</h1>
            <img
              src="/redChecked.jpg"
              className="w-[23px] h-[23px] lg:w-[33px] lg:h-[33px]"
            ></img>
          </div>
          <div className="flex flex-row justify-center items-center mb-[38px] lg:mb-[64px]">
            <h1 className="text-[15px]  lg:font-bold">Payment made</h1>
            <img
              src="/checked.jpg"
              className="w-[23px] h-[23px] lg:w-[33px] lg:h-[33px]"
            ></img>
          </div>

          <motion.button
            onClick={book_seat}
            whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
            whileHover={{ backgroundColor: "#F4C400" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-[#FFDD00] text-[15px] cursor-pointer font-bold items-center w-[123px] h-[45px] mb-[33px] lg:w-[293px] lg:h-[59px] lg:text-[25px]  lg:mx-auto lg:mb-[48px]"
          >
            {" "}
            Book seat
          </motion.button>
          <p className="text-center mb-[46px] lg:mr-[23.57px] lg:ml-[27px] lg:text-[17px]">
            You now have access to make use of the Borderless <br /> web3
            product house
          </p>
        </motion.div>
      </CheckIns>
    </div>
  );
}
