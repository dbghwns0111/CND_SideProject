// src/api/config.jsx

// 환경 변수에서 API 설정 불러오기
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;

// API 설정이 완료되지 않았을 경우를 대비한 유효성 검사
if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL 환경 변수를 설정해야 합니다.");
}