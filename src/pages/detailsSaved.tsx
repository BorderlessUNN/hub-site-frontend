import { motion } from "framer-motion";
import GuestDetails from "./guestDetails";
import { useNavigate } from "react-router-dom";
export default function SaveDetails({
  checked_in_email,
}: {
  checked_in_email: string;
}) {
  const navigate = useNavigate();
  const proceed = () => {
    navigate("/dashboard/seats");
  };
  return (
    <div>
      <GuestDetails checked_in_email={checked_in_email}>
        <motion.div
          className=" absolute flex flex-col justify-center items-center bg-white right-[30px] left-[30px] bottom-[308px] lg:max-h-[502px] lg:max-w-[831px] lg:top-[240px]  lg:left-[340px] border-1 border-yellow-400 border-solid rounded "
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/checked.jpg"
            className="w-[67px] h-[67px] lg:w-[127px] mt-[29px] mb-[24px]  lg:h-[127px] lg:mb-[29px]"
          ></img>
          <p className="text-[11px] lg:text-[17px] mb-[33px] lg:mb-[38px] text-center">
            Details of guest saved <br /> succesfully
          </p>
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
            whileHover={{ backgroundColor: "#F4C400" }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={proceed}
            className=" w-[94px] h-[37px] mb-[29px] lg:mb-[52px] lg:w-[184px] lg:h-[60px] lg:text-[25px] bg-[#FFDD00] font-bold cursor-pointer"
          >
            Proceed
          </motion.button>
          <p className="hidden text-center lg:block lg:mb-[30px]">
            You now have acces to make use of the Borderless <br /> product
            house
          </p>
        </motion.div>
      </GuestDetails>
    </div>
  );
}
