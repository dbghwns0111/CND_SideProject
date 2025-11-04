import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCTA({ className = "" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/auth");
  };

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-[#29CC8B] text-white font-semibold rounded-full shadow-md hover:brightness-95"
      >
        로그인 / 회원가입
      </button>
    </div>
  );
}
