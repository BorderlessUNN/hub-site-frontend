import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { captureNonMember } from "../../services/apis/member";

export default function GuestDetails({
  children,
  checked_in_email,
}: {
  children?: React.ReactNode;
  checked_in_email: string;
}) {
  const [loading, setloading] = useState(false);
  const [user_name, set_user_name] = useState("");
  const [whatsapp_number, set_whatsapp_number] = useState("");
  const [department, setDepartment] = useState("");
  const [tech_stack, settech_stack] = useState("");
  const [date_of_birth, setdate_of_birth] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (checked_in_email == "") navigate("/dashboard/check-ins");
  }, []);

  function inputValidator() {
    if (user_name === "" || checked_in_email === "" || !whatsapp_number) {
      setErrorMessage("fill in all fields");
      return false;
    } else return true;
  }

  const saveDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValidator()) {
      setloading(true);
      try {
        const res = await captureNonMember({
          user_name,
          email: checked_in_email,
          whatsapp_number,
          department,
          tech_stack,
          date_of_birth,
        });
        const capture_details = res.data;
        localStorage.setItem("user_id", capture_details.id);
        navigate("/dashboard/detailSaved");
      } catch (err: any) {
        setErrorMessage(`network connectivity issues`);
      } finally {
        setloading(false);
      }
    }
  };

  return (
    <div className="relative">
      <div
        className={`relative flex flex-col ${
          children && "blur-sm"
        }  min-h-screen w-full overflow-auto `}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col ml-[43px] mr-[42px] lg:ml-[127px] lg:mr-[62px]">
            <p className=" mb-[16px] lg:mb-[36px] ">
              <span className=" font-bold">BTC UNN</span> a web3 student based
              community to <br />
              designed to faster growth and train tech enthusiast and bring them{" "}
              <br /> On-chain
              <br />
            </p>
            <p className=" mb-[53px] lg:mb-[50px]">
              {" "}
              This is the official login page to users of the{" "}
              <span className="font-bold">hub </span>
              <br /> including members and non-members
            </p>
            <p className=" text-[25px] font-bold mb-[25px] lg:mb-[30px]">
              {" "}
              Sign in{" "}
            </p>
            <form onSubmit={saveDetails}>
              <input
                id="name"
                placeholder="Name..."
                type="text"
                onChange={(e) => set_user_name(e.target.value)}
                value={user_name}
                className=" placeholder:opacity-50 placeholder:text-sm placeholder:italic mr-3 w-[283px] h-[32px] mb-[40px] lg:mb-[37px] p-[10px] lg:w-[541px] lg:h-[62px] border-1 border-[#FFDD00] border-solid rounded"
              ></input>{" "}
              <input
                id="email"
                placeholder="Email"
                type="email"
                value={checked_in_email}
                disabled
                className="placeholder:opacity-50 placeholder:text-sm placeholder:italic  w-[283px] h-[32px] mb-[40px] lg:mb-[37px] p-[10px] lg:w-[541px] lg:h-[62px] border-1 border-[#FFDD00] border-solid rounded  opacity-50 cursor-not-allowed"
              ></input>
              <br />
              <input
                id="number"
                placeholder="whatsapp number"
                type="string"
                onChange={(e) => set_whatsapp_number(e.target.value)}
                value={whatsapp_number}
                className=" placeholder:opacity-50 mr-2 placeholder:text-sm placeholder:italic w-[283px] h-[32px] mb-[40px] lg:mb-[44px] p-[10px] lg:w-[541px] lg:h-[62px] border-1 border-[#FFDD00] border-solid rounded"
              ></input>{" "}
              <input
                id="department"
                placeholder="department"
                type="string"
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
                className=" placeholder:opacity-50 placeholder:text-sm placeholder:italic w-[283px] h-[32px] mb-[40px] lg:mb-[44px] p-[10px] lg:w-[541px] lg:h-[62px] border-1 border-[#FFDD00] border-solid rounded"
              ></input>
              <br />
              <input
                id="tech_stack"
                placeholder="tech_stack"
                type="string"
                onChange={(e) => settech_stack(e.target.value)}
                value={tech_stack}
                className=" placeholder:opacity-50 mr-2 placeholder:text-sm placeholder:italic w-[283px] h-[32px] mb-[40px] lg:mb-[44px] p-[10px] lg:w-[541px] lg:h-[62px] border-1 border-[#FFDD00] border-solid rounded"
              ></input>
              <input
                id="date_of_birth"
                placeholder="date_of_birth"
                type="date"
                onChange={(e) => setdate_of_birth(e.target.value)}
                value={date_of_birth}
                className=" placeholder:opacity-50 placeholder:text-sm placeholder:italic w-[283px] h-[32px] mb-[40px] lg:mb-[44px] p-[10px] lg:w-[541px] lg:h-[62px] border-1 border-[#FFDD00] border-solid rounded"
              ></input>
              <p className="text-red-500 mb-[10px] text-[20px]">
                {errorMessage}
              </p>
              <motion.button
                whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
                whileHover={{ backgroundColor: "#F4C400" }}
                transition={{ type: "spring", stiffness: 300 }}
                className={` ${
                  loading && "opacity-50 cursor-not-allowed"
                }text-[15px] font-bold h-[37px] w-[77px] mb-[35px] lg:text-[25px] lg:h-[57px] lg:w-[178px] lg:mb-[87px] bg-[#FFDD00] border-1 border-[#FFDD00] border-solid rounded ${
                  children ? "opacity-50 cursor-not-allowed" : " "
                }`}
                disabled={!!children}
              >
                {" "}
                {loading ? "Processing.." : "Save"}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
