import React, { useState } from "react";
import SocialButtons from "../components/auth/SocialButtons";
import { useAuth } from "../store/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSocial = (provider) => {
    // simulate social login
    login({ name: `${provider}_user`, email: `${provider}@example.com` });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-b from-white via-green-50 to-green-100 p-6">
      <div className="w-full max-w-4xl mx-auto flex justify-center">
        <div className="w-full max-w-sm p-6 flex flex-col items-center">
          <img src="/full_logo.svg" alt="Lawkey" className="mb-6 w-40 h-auto" />
          <div className="w-full rounded-xl bg-white p-6 flex flex-col items-center shadow-lg">
            <h2 className="text-2xl font-bold mb-5 text-center">
              로그인 | 회원가입
            </h2>
            <div className="w-full max-w-md">
              <SocialButtons onSocial={handleSocial} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
