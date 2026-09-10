import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "dark" | "outline";

const variantClasses: Record<Variant, string> = {
  primary: "bg-[#FFDD00] text-[#04252D] hover:bg-[#F4C400]",
  dark: "bg-[#04252D] text-white hover:bg-[#091b25]",
  outline: "border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] hover:bg-white",
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-5 py-3 text-sm font-semibold transition ${
        variantClasses[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {children}
    </motion.button>
  );
}
