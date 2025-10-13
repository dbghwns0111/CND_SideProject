import React from 'react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // hash값을 location.state로 전달받음
  const hash = location.state?.hash;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hash) {
        navigate(`/c/${hash}`);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [hash, navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white">
      <div className="text-2xl font-bold mb-8">LOGO</div>
      <div className="mb-4 text-gray-500">새로운 대화 세션을 준비 중입니다...</div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default LoadingPage;
