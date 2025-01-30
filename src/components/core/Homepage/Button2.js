import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

const Button2 = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] hover:shadow-none hover:scale-95 transition-all duration-200 ${
          active ? "bg-[#000] text-white " : "bg-[#000] text-white opacity-60"
        }`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button2;
