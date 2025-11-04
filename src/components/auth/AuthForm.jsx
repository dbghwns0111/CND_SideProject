import React, { useState } from "react";
import { useAuth } from "../../store/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ mode = "login" }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const submit = (e) => {
    e?.preventDefault();
    // For now, do a simple client-side login simulation
    const user = {
      name: name || "사용자",
      email: email || "guest@example.com",
    };
    login(user);
    navigate("/");
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md mx-auto bg-white/80 p-6 rounded-xl shadow"
    >
      {mode === "signup" && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">이름</label>
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">이메일</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-1">비밀번호</label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-2 rounded bg-[#29CC8B] text-white font-bold"
        >
          {mode === "signup" ? "회원가입" : "로그인"}
        </button>
      </div>
    </form>
  );
}
