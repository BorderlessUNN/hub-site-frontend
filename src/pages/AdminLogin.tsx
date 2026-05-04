import { useState } from "react";
// import { useAuth } from "../context/authContext";
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
      navigate("check-ins");
      console.log("navigating");
    } catch (error: any) {
      setErroMessage(error.message);
    } finally {
      setloading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col mx-auto  w-full h-screen overflow-auto ">
        <img
          className=" w-[82px] h-[94px] mx-auto mt-[100px] lg:w-[125px] lg:h-[143.88px] lg:mt-[2px]"
          src="/avatar.jpg"
        ></img>
        <img
          className=" w-[142px] h-[31px] lg:w-[262.21px] lg:h-[57px] mx-auto"
          src="/logo.png"
        ></img>
        <h1 className="font-bold mb-[36px] mt-[10px] lg:mt-[16px] text-center">
          {" "}
          Tech club unn
        </h1>
        <p className="font-bold text-center">Admin Login</p>
        <form onSubmit={logIn} className="mx-auto flex flex-col items-center">
          <input
            id="email"
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="placeholder:opacity-50 placeholder:text-sm placeholder:italic mt-[20px] p-[10px] w-[283px] h-[32px] lg:w-[541px] lg:h-[62px] lg:mt-[16px] border-1 border-[#FFDD00] border-solid rounded"
            type="text"
          ></input>
          <br />
          <div className="relative w-full">
            {" "}
            <input
              id="password"
              placeholder="Password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="placeholder:opacity-50 placeholder:text-sm placeholder:italic mt-[20px] p-[10px] w-[283px] h-[32px] lg:w-[541px] lg:h-[62px] lg:mt-[16px] border-1 border-[#FFDD00] border-solid rounded"
              type={`${showpassword ? "text" : "password"}`}
            ></input>
            <button
              type="button"
              onClick={() => setshowpassword(!showpassword)}
              className="absolute right-[8px] top-[25px] lg:right-[21px] lg:top-[35px]"
            >
              {showpassword ? (
                <Eye className="w-[14px] h-[14px] lg:w-[20px] lg:h-[20px]" />
              ) : (
                <EyeOff className="w-[14px] h-[14px] lg:w-[20px] lg:h-[20px]" />
              )}
            </button>
          </div>

          <br />
          <p className="text-red-500 mb-[10px] text-[20px]">{errorMessage}</p>
          <motion.button
            whileTap={{ scale: 0.95, backgroundColor: "#F4C400" }}
            whileHover={{ backgroundColor: "#F4C400" }}
            transition={{ type: "spring", stiffness: "300" }}
            className={` ${
              loading && "opacity-50 cursor-not-allowed"
            }w-[85px] h-[35px] text-center p-[10px] mb-[20px] mt-[39px] lg:w-[176px] lg:h-[60px] bg-[#FFDD00] lg:mt-[29px]`}
          >
            Log in
          </motion.button>
        </form>
      </div>
    </>
  );
}
