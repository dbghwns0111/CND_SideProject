import React from "react";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../../styles/auth.css";

export default function SocialButtons({ onSocial }) {
  return (
    <div className="social-buttons">
      <button
        type="button"
        className="social-btn social-kakao"
        onClick={() => onSocial("kakao")}
      >
        <span className="social-label">카카오로 시작하기</span>
      </button>

      <button
        type="button"
        className="social-btn social-google"
        onClick={() => onSocial("google")}
      >
        <FcGoogle size={20} className="social-icon" />
        <span className="social-label">구글로 시작하기</span>
      </button>

      <button
        type="button"
        className="social-btn social-naver"
        onClick={() => onSocial("naver")}
      >
        <span className="social-label">네이버로 시작하기</span>
      </button>

      <button
        type="button"
        className="social-btn social-apple"
        onClick={() => onSocial("apple")}
      >
        <FaApple size={16} className="social-icon white" />
        <span className="social-label">애플로 시작하기</span>
      </button>
    </div>
  );
}
